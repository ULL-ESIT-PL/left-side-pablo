// @flow

import * as N from "../types";
import { types as tt, type TokenType } from "../tokenizer/types";
import ExpressionParser from "./expression";
import { Errors } from "./error";
import {
  isIdentifierChar,
  isIdentifierStart,
  keywordRelationalOperator,
} from "../util/identifier";
import { lineBreak } from "../util/whitespace";
import * as charCodes from "charcodes";
import {
  BIND_CLASS,
  BIND_LEXICAL,
  BIND_VAR,
  BIND_FUNCTION,
  SCOPE_CLASS,
  SCOPE_FUNCTION,
  SCOPE_OTHER,
  SCOPE_SIMPLE_CATCH,
  SCOPE_SUPER,
  CLASS_ELEMENT_OTHER,
  CLASS_ELEMENT_INSTANCE_GETTER,
  CLASS_ELEMENT_INSTANCE_SETTER,
  CLASS_ELEMENT_STATIC_GETTER,
  CLASS_ELEMENT_STATIC_SETTER,
  type BindingTypes,
} from "../util/scopeflags";
import { ExpressionErrors } from "./util";
import { PARAM, functionFlags } from "../util/production-parameter";

const loopLabel = { kind: "loop" },
  switchLabel = { kind: "switch" };

const FUNC_NO_FLAGS = 0b000,
  FUNC_STATEMENT = 0b001,
  FUNC_HANGING_STATEMENT = 0b010,
  FUNC_NULLABLE_ID = 0b100;

export default class StatementParser extends ExpressionParser {
  // ### Statement parsing

  // Parse a program. Initializes the parser, reads any number of
  // statements, and wraps them in a Program node.  Optionally takes a
  // `program` argument.  If present, the statements will be appended
  // to its body instead of creating a new node.

  parseTopLevel(file: N.File, program: N.Program): N.File {
    program.sourceType = this.options.sourceType;

    program.interpreter = this.parseInterpreterDirective();

    this.parseBlockBody(program, true, true, tt.eof);

    if (
      this.inModule &&
      !this.options.allowUndeclaredExports &&
      this.scope.undefinedExports.size > 0
    ) {
      for (const [name] of Array.from(this.scope.undefinedExports)) {
        const pos = this.scope.undefinedExports.get(name);
        // $FlowIssue
        this.raise(pos, Errors.ModuleExportUndefined, name);
      }
    }

    file.program = this.finishNode(program, "Program");
    file.comments = this.state.comments;

    if (this.options.tokens) file.tokens = this.tokens;

    return this.finishNode(file, "File");
  }

  // TODO

  stmtToDirective(stmt: N.Statement): N.Directive {
    const expr = stmt.expression;

    const directiveLiteral = this.startNodeAt(expr.start, expr.loc.start);
    const directive = this.startNodeAt(stmt.start, stmt.loc.start);

    const raw = this.input.slice(expr.start, expr.end);
    const val = (directiveLiteral.value = raw.slice(1, -1)); // remove quotes

    this.addExtra(directiveLiteral, "raw", raw);
    this.addExtra(directiveLiteral, "rawValue", val);

    directive.value = this.finishNodeAt(
      directiveLiteral,
      "DirectiveLiteral",
      expr.end,
      expr.loc.end,
    );

    return this.finishNodeAt(directive, "Directive", stmt.end, stmt.loc.end);
  }

  parseInterpreterDirective(): N.InterpreterDirective | null {
    if (!this.match(tt.interpreterDirective)) {
      return null;
    }

    const node = this.startNode();
    node.value = this.state.value;
    this.next();
    return this.finishNode(node, "InterpreterDirective");
  }

  isLet(context: ?string): boolean {
    if (!this.isContextual("let")) {
      return false;
    }
    const next = this.nextTokenStart();
    const nextCh = this.input.charCodeAt(next);
    // For ambiguous cases, determine if a LexicalDeclaration (or only a
    // Statement) is allowed here. If context is not empty then only a Statement
    // is allowed. However, `let [` is an explicit negative lookahead for
    // ExpressionStatement, so special-case it first.
    if (nextCh === charCodes.leftSquareBracket) return true;
    if (context) return false;

    if (nextCh === charCodes.leftCurlyBrace) return true;

    if (isIdentifierStart(nextCh)) {
      let pos = next + 1;
      while (isIdentifierChar(this.input.charCodeAt(pos))) {
        ++pos;
      }
      const ident = this.input.slice(next, pos);
      if (!keywordRelationalOperator.test(ident)) return true;
    }
    return false;
  }

  // Parse a single statement.
  //
  // If expecting a statement and finding a slash operator, parse a
  // regular expression literal. This is to handle cases like
  // `if (foo) /blah/.exec(foo)`, where looking at the previous token
  // does not help.

  parseStatement(context: ?string, topLevel?: boolean): N.Statement {
    if (this.match(tt.at)) {
      this.parseDecorators(true);
    }
    return this.parseStatementContent(context, topLevel);
  }

  parseStatementContent(context: ?string, topLevel: ?boolean): N.Statement {
    let starttype = this.state.type;
    const node = this.startNode();
    let kind;

    if (this.isLet(context)) {
      starttype = tt._var;
      kind = "let";
    }

    // Most types of statements are recognized by the keyword they
    // start with. Many are trivial to parse, some require a bit of
    // complexity.

    switch (starttype) {
      case tt._break:
      case tt._continue:
        // $FlowFixMe
        return this.parseBreakContinueStatement(node, starttype.keyword);
      case tt._debugger:
        return this.parseDebuggerStatement(node);
      case tt._do:
        return this.parseDoStatement(node);
      case tt._for:
        return this.parseForStatement(node);
      case tt._function:
        if (this.lookaheadCharCode() === charCodes.dot) break;
        if (context) {
          if (this.state.strict) {
            this.raise(this.state.start, Errors.StrictFunction);
          } else if (context !== "if" && context !== "label") {
            this.raise(this.state.start, Errors.SloppyFunction);
          }
        }
        return this.parseFunctionStatement(node, false, !context);

      case tt._class:
        if (context) this.unexpected();
        return this.parseClass(node, true);

      case tt._if:
        return this.parseIfStatement(node);
      case tt._return:
        return this.parseReturnStatement(node);
      case tt._switch:
        return this.parseSwitchStatement(node);
      case tt._throw:
        return this.parseThrowStatement(node);
      case tt._try:
        return this.parseTryStatement(node);

      case tt._const:
      case tt._var:
        kind = kind || this.state.value;
        if (context && kind !== "var") {
          this.raise(this.state.start, Errors.UnexpectedLexicalDeclaration);
        }
        return this.parseVarStatement(node, kind);

      case tt._while:
        return this.parseWhileStatement(node);
      case tt._with:
        return this.parseWithStatement(node);
      case tt.braceL:
        return this.parseBlock();
      case tt.semi:
        return this.parseEmptyStatement(node);
      case tt._export:
      case tt._import: {
        const nextTokenCharCode = this.lookaheadCharCode();
        if (
          nextTokenCharCode === charCodes.leftParenthesis ||
          nextTokenCharCode === charCodes.dot
        ) {
          break;
        }

        if (!this.options.allowImportExportEverywhere && !topLevel) {
          this.raise(this.state.start, Errors.UnexpectedImportExport);
        }

        this.next();

        let result;
        if (starttype === tt._import) {
          result = this.parseImport(node);

          if (
            result.type === "ImportDeclaration" &&
            (!result.importKind || result.importKind === "value")
          ) {
            this.sawUnambiguousESM = true;
          }
        } else {
          result = this.parseExport(node);

          if (
            (result.type === "ExportNamedDeclaration" &&
              (!result.exportKind || result.exportKind === "value")) ||
            (result.type === "ExportAllDeclaration" &&
              (!result.exportKind || result.exportKind === "value")) ||
            result.type === "ExportDefaultDeclaration"
          ) {
            this.sawUnambiguousESM = true;
          }
        }

        this.assertModuleNodeAllowed(node);

        return result;
      }

      default: {
        if (this.isAsyncFunction()) {
          if (context) {
            this.raise(
              this.state.start,
              Errors.AsyncFunctionInSingleStatementContext,
            );
          }
          this.next();
          return this.parseFunctionStatement(node, true, !context);
        }
      }
    }

    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
    const maybeName = this.state.value;
    const expr = this.parseExpression();

    if (
      starttype === tt.name &&
      expr.type === "Identifier" &&
      this.eat(tt.colon)
    ) {
      return this.parseLabeledStatement(node, maybeName, expr, context);
    } else {
      return this.parseExpressionStatement(node, expr);
    }
  }

  assertModuleNodeAllowed(node: N.Node): void {
    if (!this.options.allowImportExportEverywhere && !this.inModule) {
      this.raiseWithData(
        node.start,
        {
          code: "BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED",
        },
        Errors.ImportOutsideModule,
      );
    }
  }

  takeDecorators(node: N.HasDecorators): void {
    const decorators = this.state.decoratorStack[
      this.state.decoratorStack.length - 1
    ];
    if (decorators.length) {
      node.decorators = decorators;
      this.resetStartLocationFromNode(node, decorators[0]);
      this.state.decoratorStack[this.state.decoratorStack.length - 1] = [];
    }
  }

  canHaveLeadingDecorator(): boolean {
    return this.match(tt._class);
  }

  parseDecorators(allowExport?: boolean): void {
    const currentContextDecorators = this.state.decoratorStack[
      this.state.decoratorStack.length - 1
    ];
    while (this.match(tt.at)) {
      const decorator = this.parseDecorator();
      currentContextDecorators.push(decorator);
    }

    if (this.match(tt._export)) {
      if (!allowExport) {
        this.unexpected();
      }

      if (
        this.hasPlugin("decorators") &&
        !this.getPluginOption("decorators", "decoratorsBeforeExport")
      ) {
        this.raise(this.state.start, Errors.DecoratorExportClass);
      }
    } else if (!this.canHaveLeadingDecorator()) {
      throw this.raise(this.state.start, Errors.UnexpectedLeadingDecorator);
    }
  }

  parseDecorator(): N.Decorator {
    this.expectOnePlugin(["decorators-legacy", "decorators"]);

    const node = this.startNode();
    this.next();

    if (this.hasPlugin("decorators")) {
      // Every time a decorator class expression is evaluated, a new empty array is pushed onto the stack
      // So that the decorators of any nested class expressions will be dealt with separately
      this.state.decoratorStack.push([]);

      const startPos = this.state.start;
      const startLoc = this.state.startLoc;
      let expr: N.Expression;

      if (this.eat(tt.parenL)) {
        expr = this.parseExpression();
        this.expect(tt.parenR);
      } else {
        expr = this.parseIdentifier(false);

        while (this.eat(tt.dot)) {
          const node = this.startNodeAt(startPos, startLoc);
          node.object = expr;
          node.property = this.parseIdentifier(true);
          node.computed = false;
          expr = this.finishNode(node, "MemberExpression");
        }
      }

      node.expression = this.parseMaybeDecoratorArguments(expr);
      this.state.decoratorStack.pop();
    } else {
      node.expression = this.parseExprSubscripts();
    }
    return this.finishNode(node, "Decorator");
  }

  parseMaybeDecoratorArguments(expr: N.Expression): N.Expression {
    if (this.eat(tt.parenL)) {
      const node = this.startNodeAtNode(expr);
      node.callee = expr;
      node.arguments = this.parseCallExpressionArguments(tt.parenR, false);
      this.toReferencedList(node.arguments);
      return this.finishNode(node, "CallExpression");
    }

    return expr;
  }

  parseBreakContinueStatement(
    node: N.BreakStatement | N.ContinueStatement,
    keyword: string,
  ): N.BreakStatement | N.ContinueStatement {
    const isBreak = keyword === "break";
    this.next();

    if (this.isLineTerminator()) {
      node.label = null;
    } else {
      node.label = this.parseIdentifier();
      this.semicolon();
    }

    this.verifyBreakContinue(node, keyword);

    return this.finishNode(
      node,
      isBreak ? "BreakStatement" : "ContinueStatement",
    );
  }

  verifyBreakContinue(
    node: N.BreakStatement | N.ContinueStatement,
    keyword: string,
  ) {
    const isBreak = keyword === "break";
    let i;
    for (i = 0; i < this.state.labels.length; ++i) {
      const lab = this.state.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
        if (node.label && isBreak) break;
      }
    }
    if (i === this.state.labels.length) {
      this.raise(node.start, Errors.IllegalBreakContinue, keyword);
    }
  }

  parseDebuggerStatement(node: N.DebuggerStatement): N.DebuggerStatement {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement");
  }

  parseHeaderExpression(): N.Expression {
    this.expect(tt.parenL);
    const val = this.parseExpression();
    this.expect(tt.parenR);
    return val;
  }

  parseDoStatement(node: N.DoWhileStatement): N.DoWhileStatement {
    this.next();
    this.state.labels.push(loopLabel);

    node.body =
      // For the smartPipelines plugin: Disable topic references from outer
      // contexts within the loop body. They are permitted in test expressions,
      // outside of the loop body.
      this.withTopicForbiddingContext(() =>
        // Parse the loop body's body.
        this.parseStatement("do"),
      );

    this.state.labels.pop();

    this.expect(tt._while);
    node.test = this.parseHeaderExpression();
    this.eat(tt.semi);
    return this.finishNode(node, "DoWhileStatement");
  }

  // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
  // loop is non-trivial. Basically, we have to parse the init `var`
  // statement or expression, disallowing the `in` operator (see
  // the second parameter to `parseExpression`), and then check
  // whether the next token is `in` or `of`. When there is no init
  // part (semicolon immediately after the opening parenthesis), it
  // is a regular `for` loop.

  parseForStatement(node: N.Node): N.ForLike {
    this.next();
    this.state.labels.push(loopLabel);

    let awaitAt = -1;
    if (this.isAwaitAllowed() && this.eatContextual("await")) {
      awaitAt = this.state.lastTokStart;
    }
    this.scope.enter(SCOPE_OTHER);
    this.expect(tt.parenL);

    if (this.match(tt.semi)) {
      if (awaitAt > -1) {
        this.unexpected(awaitAt);
      }
      return this.parseFor(node, null);
    }

    const isLet = this.isLet();
    if (this.match(tt._var) || this.match(tt._const) || isLet) {
      const init = this.startNode();
      const kind = isLet ? "let" : this.state.value;
      this.next();
      this.parseVar(init, true, kind);
      this.finishNode(init, "VariableDeclaration");

      if (
        (this.match(tt._in) || this.isContextual("of")) &&
        init.declarations.length === 1
      ) {
        return this.parseForIn(node, init, awaitAt);
      }
      if (awaitAt > -1) {
        this.unexpected(awaitAt);
      }
      return this.parseFor(node, init);
    }

    const refExpressionErrors = new ExpressionErrors();
    const init = this.parseExpression(true, refExpressionErrors);
    if (this.match(tt._in) || this.isContextual("of")) {
      this.toAssignable(init);
      const description = this.isContextual("of")
        ? "for-of statement"
        : "for-in statement";
      this.checkLVal(init, undefined, undefined, description);
      return this.parseForIn(node, init, awaitAt);
    } else {
      this.checkExpressionErrors(refExpressionErrors, true);
    }
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, init);
  }

  parseFunctionStatement(
    node: N.FunctionDeclaration,
    isAsync?: boolean,
    declarationPosition?: boolean,
  ): N.FunctionDeclaration {
    this.next();
    return this.parseFunction(
      node,
      FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT),
      isAsync,
    );
  }

  parseIfStatement(node: N.IfStatement): N.IfStatement {
    this.next();
    node.test = this.parseHeaderExpression();
    node.consequent = this.parseStatement("if");
    node.alternate = this.eat(tt._else) ? this.parseStatement("if") : null;
    return this.finishNode(node, "IfStatement");
  }

  parseReturnStatement(node: N.ReturnStatement): N.ReturnStatement {
    if (!this.prodParam.hasReturn && !this.options.allowReturnOutsideFunction) {
      this.raise(this.state.start, Errors.IllegalReturn);
    }

    this.next();

    // In `return` (and `break`/`continue`), the keywords with
    // optional arguments, we eagerly look for a semicolon or the
    // possibility to insert one.

    if (this.isLineTerminator()) {
      node.argument = null;
    } else {
      node.argument = this.parseExpression();
      this.semicolon();
    }

    return this.finishNode(node, "ReturnStatement");
  }

  parseSwitchStatement(node: N.SwitchStatement): N.SwitchStatement {
    this.next();
    node.discriminant = this.parseHeaderExpression();
    const cases = (node.cases = []);
    this.expect(tt.braceL);
    this.state.labels.push(switchLabel);
    this.scope.enter(SCOPE_OTHER);

    // Statements under must be grouped (by label) in SwitchCase
    // nodes. `cur` is used to keep the node that we are currently
    // adding statements to.

    let cur;
    for (let sawDefault; !this.match(tt.braceR); ) {
      if (this.match(tt._case) || this.match(tt._default)) {
        const isCase = this.match(tt._case);
        if (cur) this.finishNode(cur, "SwitchCase");
        cases.push((cur = this.startNode()));
        cur.consequent = [];
        this.next();
        if (isCase) {
          cur.test = this.parseExpression();
        } else {
          if (sawDefault) {
            this.raise(
              this.state.lastTokStart,
              Errors.MultipleDefaultsInSwitch,
            );
          }
          sawDefault = true;
          cur.test = null;
        }
        this.expect(tt.colon);
      } else {
        if (cur) {
          cur.consequent.push(this.parseStatement(null));
        } else {
          this.unexpected();
        }
      }
    }
    this.scope.exit();
    if (cur) this.finishNode(cur, "SwitchCase");
    this.next(); // Closing brace
    this.state.labels.pop();
    return this.finishNode(node, "SwitchStatement");
  }

  parseThrowStatement(node: N.ThrowStatement): N.ThrowStatement {
    this.next();
    if (
      lineBreak.test(this.input.slice(this.state.lastTokEnd, this.state.start))
    ) {
      this.raise(this.state.lastTokEnd, Errors.NewlineAfterThrow);
    }
    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement");
  }

  parseTryStatement(node: N.TryStatement): N.TryStatement {
    this.next();

    node.block = this.parseBlock();
    node.handler = null;

    if (this.match(tt._catch)) {
      const clause = this.startNode();
      this.next();
      if (this.match(tt.parenL)) {
        this.expect(tt.parenL);
        clause.param = this.parseBindingAtom();
        const simple = clause.param.type === "Identifier";
        this.scope.enter(simple ? SCOPE_SIMPLE_CATCH : 0);
        this.checkLVal(clause.param, BIND_LEXICAL, null, "catch clause");
        this.expect(tt.parenR);
      } else {
        clause.param = null;
        this.scope.enter(SCOPE_OTHER);
      }

      clause.body =
        // For the smartPipelines plugin: Disable topic references from outer
        // contexts within the catch clause's body.
        this.withTopicForbiddingContext(() =>
          // Parse the catch clause's body.
          this.parseBlock(false, false),
        );
      this.scope.exit();

      node.handler = this.finishNode(clause, "CatchClause");
    }

    node.finalizer = this.eat(tt._finally) ? this.parseBlock() : null;

    if (!node.handler && !node.finalizer) {
      this.raise(node.start, Errors.NoCatchOrFinally);
    }

    return this.finishNode(node, "TryStatement");
  }

  parseVarStatement(
    node: N.VariableDeclaration,
    kind: "var" | "let" | "const",
  ): N.VariableDeclaration {
    this.next();
    this.parseVar(node, false, kind);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration");
  }

  parseWhileStatement(node: N.WhileStatement): N.WhileStatement {
    this.next();
    node.test = this.parseHeaderExpression();
    this.state.labels.push(loopLabel);

    node.body =
      // For the smartPipelines plugin:
      // Disable topic references from outer contexts within the loop body.
      // They are permitted in test expressions, outside of the loop body.
      this.withTopicForbiddingContext(() =>
        // Parse loop body.
        this.parseStatement("while"),
      );

    this.state.labels.pop();

    return this.finishNode(node, "WhileStatement");
  }

  parseWithStatement(node: N.WithStatement): N.WithStatement {
    if (this.state.strict) {
      this.raise(this.state.start, Errors.StrictWith);
    }
    this.next();
    node.object = this.parseHeaderExpression();

    node.body =
      // For the smartPipelines plugin:
      // Disable topic references from outer contexts within the with statement's body.
      // They are permitted in function default-parameter expressions, which are
      // part of the outer context, outside of the with statement's body.
      this.withTopicForbiddingContext(() =>
        // Parse the statement body.
        this.parseStatement("with"),
      );

    return this.finishNode(node, "WithStatement");
  }

  parseEmptyStatement(node: N.EmptyStatement): N.EmptyStatement {
    this.next();
    return this.finishNode(node, "EmptyStatement");
  }

  parseLabeledStatement(
    node: N.LabeledStatement,
    maybeName: string,
    expr: N.Identifier,
    context: ?string,
  ): N.LabeledStatement {
    for (const label of this.state.labels) {
      if (label.name === maybeName) {
        this.raise(expr.start, Errors.LabelRedeclaration, maybeName);
      }
    }

    const kind = this.state.type.isLoop
      ? "loop"
      : this.match(tt._switch)
      ? "switch"
      : null;
    for (let i = this.state.labels.length - 1; i >= 0; i--) {
      const label = this.state.labels[i];
      if (label.statementStart === node.start) {
        label.statementStart = this.state.start;
        label.kind = kind;
      } else {
        break;
      }
    }

    this.state.labels.push({
      name: maybeName,
      kind: kind,
      statementStart: this.state.start,
    });
    node.body = this.parseStatement(
      context
        ? context.indexOf("label") === -1
          ? context + "label"
          : context
        : "label",
    );

    this.state.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement");
  }

  parseExpressionStatement(
    node: N.ExpressionStatement,
    expr: N.Expression,
  ): N.Statement {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement");
  }

  // Parse a semicolon-enclosed block of statements, handling `"use
  // strict"` declarations when `allowStrict` is true (used for
  // function bodies).

  parseBlock(
    allowDirectives?: boolean = false,
    createNewLexicalScope?: boolean = true,
    afterBlockParse?: (hasStrictModeDirective: boolean) => void,
  ): N.BlockStatement {
    const node = this.startNode();
    this.expect(tt.braceL);
    if (createNewLexicalScope) {
      this.scope.enter(SCOPE_OTHER);
    }
    this.parseBlockBody(
      node,
      allowDirectives,
      false,
      tt.braceR,
      afterBlockParse,
    );
    if (createNewLexicalScope) {
      this.scope.exit();
    }
    return this.finishNode(node, "BlockStatement");
  }

  isValidDirective(stmt: N.Statement): boolean {
    return (
      stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "StringLiteral" &&
      !stmt.expression.extra.parenthesized
    );
  }

  parseBlockBody(
    node: N.BlockStatementLike,
    allowDirectives: ?boolean,
    topLevel: boolean,
    end: TokenType,
    afterBlockParse?: (hasStrictModeDirective: boolean) => void,
  ): void {
    const body = (node.body = []);
    const directives = (node.directives = []);
    this.parseBlockOrModuleBlockBody(
      body,
      allowDirectives ? directives : undefined,
      topLevel,
      end,
      afterBlockParse,
    );
  }

  // Undefined directives means that directives are not allowed.
  parseBlockOrModuleBlockBody(
    body: N.Statement[],
    directives: ?(N.Directive[]),
    topLevel: boolean,
    end: TokenType,
    afterBlockParse?: (hasStrictModeDirective: boolean) => void,
  ): void {
    const octalPositions = [];
    const oldStrict = this.state.strict;
    let hasStrictModeDirective = false;
    let parsedNonDirective = false;

    while (!this.match(end)) {
      // Track octal literals that occur before a "use strict" directive.
      if (!parsedNonDirective && this.state.octalPositions.length) {
        octalPositions.push(...this.state.octalPositions);
      }

      const stmt = this.parseStatement(null, topLevel);

      if (directives && !parsedNonDirective && this.isValidDirective(stmt)) {
        const directive = this.stmtToDirective(stmt);
        directives.push(directive);

        if (!hasStrictModeDirective && directive.value.value === "use strict") {
          hasStrictModeDirective = true;
          this.setStrict(true);
        }

        continue;
      }

      parsedNonDirective = true;
      body.push(stmt);
    }

    // Throw an error for any octal literals found before a
    // "use strict" directive. Strict mode will be set at parse
    // time for any literals that occur after the directive.
    if (this.state.strict && octalPositions.length) {
      for (const pos of octalPositions) {
        this.raise(pos, Errors.StrictOctalLiteral);
      }
    }

    if (afterBlockParse) {
      afterBlockParse.call(this, hasStrictModeDirective);
    }

    if (!oldStrict) {
      this.setStrict(false);
    }

    this.next();
  }

  // Parse a regular `for` loop. The disambiguation code in
  // `parseStatement` will already have parsed the init statement or
  // expression.

  parseFor(
    node: N.ForStatement,
    init: ?(N.VariableDeclaration | N.Expression),
  ): N.ForStatement {
    node.init = init;
    this.expect(tt.semi);
    node.test = this.match(tt.semi) ? null : this.parseExpression();
    this.expect(tt.semi);
    node.update = this.match(tt.parenR) ? null : this.parseExpression();
    this.expect(tt.parenR);

    node.body =
      // For the smartPipelines plugin: Disable topic references from outer
      // contexts within the loop body. They are permitted in test expressions,
      // outside of the loop body.
      this.withTopicForbiddingContext(() =>
        // Parse the loop body.
        this.parseStatement("for"),
      );

    this.scope.exit();
    this.state.labels.pop();

    return this.finishNode(node, "ForStatement");
  }

  // Parse a `for`/`in` and `for`/`of` loop, which are almost
  // same from parser's perspective.

  parseForIn(
    node: N.ForInOf,
    init: N.VariableDeclaration | N.AssignmentPattern,
    awaitAt: number,
  ): N.ForInOf {
    const isForIn = this.match(tt._in);
    this.next();

    if (isForIn) {
      if (awaitAt > -1) this.unexpected(awaitAt);
    } else {
      node.await = awaitAt > -1;
    }

    if (
      init.type === "VariableDeclaration" &&
      init.declarations[0].init != null &&
      (!isForIn ||
        this.state.strict ||
        init.kind !== "var" ||
        init.declarations[0].id.type !== "Identifier")
    ) {
      this.raise(
        init.start,
        Errors.ForInOfLoopInitializer,
        isForIn ? "for-in" : "for-of",
      );
    } else if (init.type === "AssignmentPattern") {
      this.raise(init.start, Errors.InvalidLhs, "for-loop");
    }

    node.left = init;
    node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
    this.expect(tt.parenR);

    node.body =
      // For the smartPipelines plugin:
      // Disable topic references from outer contexts within the loop body.
      // They are permitted in test expressions, outside of the loop body.
      this.withTopicForbiddingContext(() =>
        // Parse loop body.
        this.parseStatement("for"),
      );

    this.scope.exit();
    this.state.labels.pop();

    return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
  }

  // Parse a list of variable declarations.

  parseVar(
    node: N.VariableDeclaration,
    isFor: boolean,
    kind: "var" | "let" | "const",
  ): N.VariableDeclaration {
    const declarations = (node.declarations = []);
    const isTypescript = this.hasPlugin("typescript");
    node.kind = kind;
    for (;;) {
      const decl = this.startNode();
      this.parseVarId(decl, kind);
      if (this.eat(tt.eq)) {
        decl.init = this.parseMaybeAssign(isFor);
      } else {
        if (
          kind === "const" &&
          !(this.match(tt._in) || this.isContextual("of"))
        ) {
          // `const` with no initializer is allowed in TypeScript.
          // It could be a declaration like `const x: number;`.
          if (!isTypescript) {
            this.unexpected();
          }
        } else if (
          decl.id.type !== "Identifier" &&
          !(isFor && (this.match(tt._in) || this.isContextual("of")))
        ) {
          this.raise(
            this.state.lastTokEnd,
            Errors.DeclarationMissingInitializer,
            "Complex binding patterns",
          );
        }
        decl.init = null;
      }
      declarations.push(this.finishNode(decl, "VariableDeclarator"));
      if (!this.eat(tt.comma)) break;
    }
    return node;
  }

  parseVarId(decl: N.VariableDeclarator, kind: "var" | "let" | "const"): void {
    decl.id = this.parseBindingAtom();
    this.checkLVal(
      decl.id,
      kind === "var" ? BIND_VAR : BIND_LEXICAL,
      undefined,
      "variable declaration",
      kind !== "var",
    );
  }

  // Parse a function declaration or literal (depending on the
  // `isStatement` parameter).

  parseFunction<T: N.NormalFunction>(
    node: T,
    statement?: number = FUNC_NO_FLAGS,
    isAsync?: boolean = false,
  ): T {
    const isStatement = statement & FUNC_STATEMENT;
    const isHangingStatement = statement & FUNC_HANGING_STATEMENT;
    const requireId = !!isStatement && !(statement & FUNC_NULLABLE_ID);

    this.initFunction(node, isAsync);

    if (this.match(tt.star) && isHangingStatement) {
      this.raise(this.state.start, Errors.GeneratorInSingleStatementContext);
    }
    node.generator = this.eat(tt.star);
    node.assignable = this.eat(tt.atat);

    if (node.assignable && isAsync) {
      this.raise(this.state.start, Errors.AsyncAssignableFunction);
    }

    if (node.assignable && node.generator) {
      this.raise(this.state.start, Errors.GeneratorAssignableFunction);
    }

    if (isStatement) {
      node.id = this.parseFunctionId(requireId);
    }

    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    const oldYieldPos = this.state.yieldPos;
    const oldAwaitPos = this.state.awaitPos;
    this.state.maybeInArrowParameters = false;
    this.state.yieldPos = -1;
    this.state.awaitPos = -1;
    this.scope.enter(SCOPE_FUNCTION);
    this.prodParam.enter(functionFlags(isAsync, node.generator));

    if (!isStatement) {
      node.id = this.parseFunctionId();
    }

    this.parseFunctionParams(node, false, !node.assignable);

    // For the smartPipelines plugin: Disable topic references from outer
    // contexts within the function body. They are permitted in function
    // default-parameter expressions, outside of the function body.
    this.withTopicForbiddingContext(() => {
      // Parse the function body.
      this.parseFunctionBodyAndFinish(
        node,
        isStatement ? "FunctionDeclaration" : "FunctionExpression",
      );
    });

    this.prodParam.exit();
    this.scope.exit();

    if (isStatement && !isHangingStatement) {
      // We need to register this _after_ parsing the function body
      // because of TypeScript body-less function declarations,
      // which shouldn't be added to the scope.
      this.registerFunctionStatementId(node);
    }

    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    this.state.yieldPos = oldYieldPos;
    this.state.awaitPos = oldAwaitPos;

    return node;
  }

  parseFunctionId(requireId?: boolean): ?N.Identifier {
    return requireId || this.match(tt.name) ? this.parseIdentifier() : null;
  }

  parseFunctionParams(node: N.Function, allowModifiers?: boolean, allowSpreadable?: boolean): void {
    const oldInParameters = this.state.inParameters;
    this.state.inParameters = true;

    this.expect(tt.parenL);
    node.params = this.parseBindingList(
      tt.parenR,
      charCodes.rightParenthesis,
      /* allowEmpty */ false,
      allowModifiers,
      allowSpreadable
    );

    this.state.inParameters = oldInParameters;
    this.checkYieldAwaitInDefaultParams();
  }

  registerFunctionStatementId(node: N.Function): void {
    if (!node.id) return;

    // If it is a regular function declaration in sloppy mode, then it is
    // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding
    // mode depends on properties of the current scope (see
    // treatFunctionsAsVar).
    this.scope.declareName(
      node.id.name,
      this.state.strict || node.generator || node.async
        ? this.scope.treatFunctionsAsVar
          ? BIND_VAR
          : BIND_LEXICAL
        : BIND_FUNCTION,
      node.id.start,
    );
  }

  // Parse a class declaration or literal (depending on the
  // `isStatement` parameter).

  parseClass<T: N.Class>(
    node: T,
    isStatement: /* T === ClassDeclaration */ boolean,
    optionalId?: boolean,
  ): T {
    this.next();
    this.takeDecorators(node);

    // A class definition is always strict mode code.
    const oldStrict = this.state.strict;
    this.state.strict = true;

    this.parseClassId(node, isStatement, optionalId);
    this.parseClassSuper(node);
    node.body = this.parseClassBody(!!node.superClass, oldStrict);

    this.state.strict = oldStrict;

    return this.finishNode(
      node,
      isStatement ? "ClassDeclaration" : "ClassExpression",
    );
  }

  isClassProperty(): boolean {
    return this.match(tt.eq) || this.match(tt.semi) || this.match(tt.braceR);
  }

  isClassMethod(): boolean {
    return this.match(tt.parenL);
  }

  isNonstaticConstructor(method: N.ClassMethod | N.ClassProperty): boolean {
    return (
      !method.computed &&
      !method.static &&
      (method.key.name === "constructor" || // Identifier
        method.key.value === "constructor") // String literal
    );
  }

  parseClassBody(
    constructorAllowsSuper: boolean,
    oldStrict?: boolean,
  ): N.ClassBody {
    this.classScope.enter();

    const state = { hadConstructor: false };
    let decorators: N.Decorator[] = [];
    const classBody: N.ClassBody = this.startNode();
    classBody.body = [];

    this.expect(tt.braceL);

    // For the smartPipelines plugin: Disable topic references from outer
    // contexts within the class body.
    this.withTopicForbiddingContext(() => {
      while (!this.match(tt.braceR)) {
        if (this.eat(tt.semi)) {
          if (decorators.length > 0) {
            throw this.raise(this.state.lastTokEnd, Errors.DecoratorSemicolon);
          }
          continue;
        }

        if (this.match(tt.at)) {
          decorators.push(this.parseDecorator());
          continue;
        }

        const member = this.startNode();

        // steal the decorators if there are any
        if (decorators.length) {
          member.decorators = decorators;
          this.resetStartLocationFromNode(member, decorators[0]);
          decorators = [];
        }

        this.parseClassMember(classBody, member, state, constructorAllowsSuper);

        if (
          member.kind === "constructor" &&
          member.decorators &&
          member.decorators.length > 0
        ) {
          this.raise(member.start, Errors.DecoratorConstructor);
        }
      }
    });

    if (!oldStrict) {
      this.state.strict = false;
    }

    this.next();

    if (decorators.length) {
      throw this.raise(this.state.start, Errors.TrailingDecorator);
    }

    this.classScope.exit();

    return this.finishNode(classBody, "ClassBody");
  }

  // returns true if the current identifier is a method/field name,
  // false if it is a modifier
  parseClassMemberFromModifier(
    classBody: N.ClassBody,
    member: N.ClassMember,
  ): boolean {
    const containsEsc = this.state.containsEsc;
    const key = this.parseIdentifier(true); // eats the modifier

    if (this.isClassMethod()) {
      const method: N.ClassMethod = (member: any);

      // a method named like the modifier
      method.kind = "method";
      method.computed = false;
      method.key = key;
      method.static = false;
      this.pushClassMethod(
        classBody,
        method,
        false,
        false,
        /* isConstructor */ false,
        false,
      );
      return true;
    } else if (this.isClassProperty()) {
      const prop: N.ClassProperty = (member: any);

      // a property named like the modifier
      prop.computed = false;
      prop.key = key;
      prop.static = false;
      classBody.body.push(this.parseClassProperty(prop));
      return true;
    } else if (containsEsc) {
      throw this.unexpected();
    }

    return false;
  }

  parseClassMember(
    classBody: N.ClassBody,
    member: N.ClassMember,
    state: { hadConstructor: boolean },
    constructorAllowsSuper: boolean,
  ): void {
    const isStatic = this.isContextual("static");

    if (isStatic && this.parseClassMemberFromModifier(classBody, member)) {
      // a class element named 'static'
      return;
    }

    this.parseClassMemberWithIsStatic(
      classBody,
      member,
      state,
      isStatic,
      constructorAllowsSuper,
    );
  }

  parseClassMemberWithIsStatic(
    classBody: N.ClassBody,
    member: N.ClassMember,
    state: { hadConstructor: boolean },
    isStatic: boolean,
    constructorAllowsSuper: boolean,
  ) {
    const publicMethod: $FlowSubtype<N.ClassMethod> = member;
    const privateMethod: $FlowSubtype<N.ClassPrivateMethod> = member;
    const publicProp: $FlowSubtype<N.ClassMethod> = member;
    const privateProp: $FlowSubtype<N.ClassPrivateMethod> = member;

    const method: typeof publicMethod | typeof privateMethod = publicMethod;
    const publicMember: typeof publicMethod | typeof publicProp = publicMethod;

    member.static = isStatic;

    if (this.eat(tt.star)) {
      // a generator
      method.kind = "method";
      this.parseClassPropertyName(method);

      if (method.key.type === "PrivateName") {
        // Private generator method
        this.pushClassPrivateMethod(classBody, privateMethod, true, false);
        return;
      }

      if (this.isNonstaticConstructor(publicMethod)) {
        this.raise(publicMethod.key.start, Errors.ConstructorIsGenerator);
      }

      this.pushClassMethod(
        classBody,
        publicMethod,
        true,
        false,
        /* isConstructor */ false,
        false,
      );

      return;
    }

    if (this.eat(tt.atat)) {
      // an assignable function
      method.kind = "method";
      this.parseClassPropertyName(method);

      if (method.key.type === "PrivateName") {
        // Private generator method
        this.pushClassPrivateMethod(classBody, privateMethod, false, false, true);
        return;
      }

      if (this.isNonstaticConstructor(publicMethod)) {
        this.raise(publicMethod.key.start, Errors.ConstructorIsAssignable);
      }

      this.pushClassMethod(
        classBody,
        publicMethod,
        false,
        false,
        /* isConstructor */ false,
        false,
        true
      );

      return;
    }

    const containsEsc = this.state.containsEsc;
    const key = this.parseClassPropertyName(member);
    const isPrivate = key.type === "PrivateName";
    // Check the key is not a computed expression or string literal.
    const isSimple = key.type === "Identifier";
    const maybeQuestionTokenStart = this.state.start;

    this.parsePostMemberNameModifiers(publicMember);

    if (this.isClassMethod()) {
      method.kind = "method";

      if (isPrivate) {
        this.pushClassPrivateMethod(classBody, privateMethod, false, false);
        return;
      }

      // a normal method
      const isConstructor = this.isNonstaticConstructor(publicMethod);
      let allowsDirectSuper = false;
      if (isConstructor) {
        publicMethod.kind = "constructor";

        // TypeScript allows multiple overloaded constructor declarations.
        if (state.hadConstructor && !this.hasPlugin("typescript")) {
          this.raise(key.start, Errors.DuplicateConstructor);
        }
        state.hadConstructor = true;
        allowsDirectSuper = constructorAllowsSuper;
      }

      this.pushClassMethod(
        classBody,
        publicMethod,
        false,
        false,
        isConstructor,
        allowsDirectSuper,
      );
    } else if (this.isClassProperty()) {
      if (isPrivate) {
        this.pushClassPrivateProperty(classBody, privateProp);
      } else {
        this.pushClassProperty(classBody, publicProp);
      }
    } else if (
      isSimple &&
      key.name === "async" &&
      !containsEsc &&
      !this.isLineTerminator()
    ) {
      // an async method
      const isGenerator = this.eat(tt.star);

      if (publicMember.optional) {
        this.unexpected(maybeQuestionTokenStart);
      }

      method.kind = "method";
      // The so-called parsed name would have been "async": get the real name.
      this.parseClassPropertyName(method);
      this.parsePostMemberNameModifiers(publicMember);

      if (method.key.type === "PrivateName") {
        // private async method
        this.pushClassPrivateMethod(
          classBody,
          privateMethod,
          isGenerator,
          true,
        );
      } else {
        if (this.isNonstaticConstructor(publicMethod)) {
          this.raise(publicMethod.key.start, Errors.ConstructorIsAsync);
        }

        this.pushClassMethod(
          classBody,
          publicMethod,
          isGenerator,
          true,
          /* isConstructor */ false,
          false,
        );
      }
    } else if (
      isSimple &&
      (key.name === "get" || key.name === "set") &&
      !containsEsc &&
      !(this.match(tt.star) && this.isLineTerminator())
    ) {
      // `get\n*` is an uninitialized property named 'get' followed by a generator.
      // a getter or setter
      method.kind = key.name;
      // The so-called parsed name would have been "get/set": get the real name.
      this.parseClassPropertyName(publicMethod);

      if (method.key.type === "PrivateName") {
        // private getter/setter
        this.pushClassPrivateMethod(classBody, privateMethod, false, false);
      } else {
        if (this.isNonstaticConstructor(publicMethod)) {
          this.raise(publicMethod.key.start, Errors.ConstructorIsAccessor);
        }
        this.pushClassMethod(
          classBody,
          publicMethod,
          false,
          false,
          /* isConstructor */ false,
          false,
        );
      }

      this.checkGetterSetterParams(publicMethod);
    } else if (this.isLineTerminator()) {
      // an uninitialized class property (due to ASI, since we don't otherwise recognize the next token)
      if (isPrivate) {
        this.pushClassPrivateProperty(classBody, privateProp);
      } else {
        this.pushClassProperty(classBody, publicProp);
      }
    } else {
      this.unexpected();
    }
  }

  parseClassPropertyName(member: N.ClassMember): N.Expression | N.Identifier {
    const key = this.parsePropertyName(member, /* isPrivateNameAllowed */ true);

    if (
      !member.computed &&
      member.static &&
      ((key: $FlowSubtype<N.Identifier>).name === "prototype" ||
        (key: $FlowSubtype<N.StringLiteral>).value === "prototype")
    ) {
      this.raise(key.start, Errors.StaticPrototype);
    }

    if (key.type === "PrivateName" && key.id.name === "constructor") {
      this.raise(key.start, Errors.ConstructorClassPrivateField);
    }

    return key;
  }

  pushClassProperty(classBody: N.ClassBody, prop: N.ClassProperty) {
    if (
      !prop.computed &&
      (prop.key.name === "constructor" || prop.key.value === "constructor")
    ) {
      // Non-computed field, which is either an identifier named "constructor"
      // or a string literal named "constructor"
      this.raise(prop.key.start, Errors.ConstructorClassField);
    }

    classBody.body.push(this.parseClassProperty(prop));
  }

  pushClassPrivateProperty(
    classBody: N.ClassBody,
    prop: N.ClassPrivateProperty,
  ) {
    this.expectPlugin("classPrivateProperties", prop.key.start);

    const node = this.parseClassPrivateProperty(prop);
    classBody.body.push(node);

    this.classScope.declarePrivateName(
      node.key.id.name,
      CLASS_ELEMENT_OTHER,
      node.key.start,
    );
  }

  pushClassMethod(
    classBody: N.ClassBody,
    method: N.ClassMethod,
    isGenerator: boolean,
    isAsync: boolean,
    isConstructor: boolean,
    allowsDirectSuper: boolean,
    isAssignable: boolean = false
  ): void {
    let node = this.parseMethod(
      method,
      isGenerator,
      isAsync,
      isConstructor,
      allowsDirectSuper,
      "ClassMethod",
      true,
    );
    node.isAssignable = isAssignable;
    classBody.body.push(
      node
    );
  }

  pushClassPrivateMethod(
    classBody: N.ClassBody,
    method: N.ClassPrivateMethod,
    isGenerator: boolean,
    isAsync: boolean,
    isAssignable: boolean = false
  ): void {
    this.expectPlugin("classPrivateMethods", method.key.start);

    const node = this.parseMethod(
      method,
      isGenerator,
      isAsync,
      /* isConstructor */ false,
      false,
      "ClassPrivateMethod",
      true,
    );
    node.isAssignable = isAssignable;
    classBody.body.push(node);

    const kind =
      node.kind === "get"
        ? node.static
          ? CLASS_ELEMENT_STATIC_GETTER
          : CLASS_ELEMENT_INSTANCE_GETTER
        : node.kind === "set"
        ? node.static
          ? CLASS_ELEMENT_STATIC_SETTER
          : CLASS_ELEMENT_INSTANCE_SETTER
        : CLASS_ELEMENT_OTHER;
    this.classScope.declarePrivateName(node.key.id.name, kind, node.key.start);
  }

  // Overridden in typescript.js
  parsePostMemberNameModifiers(
    // eslint-disable-next-line no-unused-vars
    methodOrProp: N.ClassMethod | N.ClassProperty,
  ): void {}

  // Overridden in typescript.js
  parseAccessModifier(): ?N.Accessibility {
    return undefined;
  }

  parseClassPrivateProperty(
    node: N.ClassPrivateProperty,
  ): N.ClassPrivateProperty {
    this.scope.enter(SCOPE_CLASS | SCOPE_SUPER);
    // [In] production parameter is tracked in parseMaybeAssign
    this.prodParam.enter(PARAM);

    node.value = this.eat(tt.eq) ? this.parseMaybeAssign() : null;
    this.semicolon();
    this.prodParam.exit();

    this.scope.exit();

    return this.finishNode(node, "ClassPrivateProperty");
  }

  parseClassProperty(node: N.ClassProperty): N.ClassProperty {
    if (!node.typeAnnotation) {
      this.expectPlugin("classProperties");
    }

    this.scope.enter(SCOPE_CLASS | SCOPE_SUPER);
    // [In] production parameter is tracked in parseMaybeAssign
    this.prodParam.enter(PARAM);

    if (this.match(tt.eq)) {
      this.expectPlugin("classProperties");
      this.next();
      node.value = this.parseMaybeAssign();
    } else {
      node.value = null;
    }
    this.semicolon();

    this.prodParam.exit();
    this.scope.exit();

    return this.finishNode(node, "ClassProperty");
  }

  parseClassId(
    node: N.Class,
    isStatement: boolean,
    optionalId: ?boolean,
    bindingType: BindingTypes = BIND_CLASS,
  ): void {
    if (this.match(tt.name)) {
      node.id = this.parseIdentifier();
      if (isStatement) {
        this.checkLVal(node.id, bindingType, undefined, "class name");
      }
    } else {
      if (optionalId || !isStatement) {
        node.id = null;
      } else {
        this.unexpected(null, Errors.MissingClassName);
      }
    }
  }

  parseClassSuper(node: N.Class): void {
    node.superClass = this.eat(tt._extends) ? this.parseExprSubscripts() : null;
  }

  // Parses module export declaration.

  parseExport(node: N.Node): N.AnyExport {
    const hasDefault = this.maybeParseExportDefaultSpecifier(node);
    const parseAfterDefault = !hasDefault || this.eat(tt.comma);
    const hasStar = parseAfterDefault && this.eatExportStar(node);
    const hasNamespace =
      hasStar && this.maybeParseExportNamespaceSpecifier(node);
    const parseAfterNamespace =
      parseAfterDefault && (!hasNamespace || this.eat(tt.comma));
    const isFromRequired = hasDefault || hasStar;

    if (hasStar && !hasNamespace) {
      if (hasDefault) this.unexpected();
      this.parseExportFrom(node, true);

      return this.finishNode(node, "ExportAllDeclaration");
    }

    const hasSpecifiers = this.maybeParseExportNamedSpecifiers(node);

    if (
      (hasDefault && parseAfterDefault && !hasStar && !hasSpecifiers) ||
      (hasNamespace && parseAfterNamespace && !hasSpecifiers)
    ) {
      throw this.unexpected(null, tt.braceL);
    }

    let hasDeclaration;
    if (isFromRequired || hasSpecifiers) {
      hasDeclaration = false;
      this.parseExportFrom(node, isFromRequired);
    } else {
      hasDeclaration = this.maybeParseExportDeclaration(node);
    }

    if (isFromRequired || hasSpecifiers || hasDeclaration) {
      this.checkExport(node, true, false, !!node.source);
      return this.finishNode(node, "ExportNamedDeclaration");
    }

    if (this.eat(tt._default)) {
      // export default ...
      node.declaration = this.parseExportDefaultExpression();
      this.checkExport(node, true, true);

      return this.finishNode(node, "ExportDefaultDeclaration");
    }

    throw this.unexpected(null, tt.braceL);
  }

  // eslint-disable-next-line no-unused-vars
  eatExportStar(node: N.Node): boolean {
    return this.eat(tt.star);
  }

  maybeParseExportDefaultSpecifier(node: N.Node): boolean {
    if (this.isExportDefaultSpecifier()) {
      // export defaultObj ...
      this.expectPlugin("exportDefaultFrom");
      const specifier = this.startNode();
      specifier.exported = this.parseIdentifier(true);
      node.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
      return true;
    }
    return false;
  }

  maybeParseExportNamespaceSpecifier(node: N.Node): boolean {
    if (this.isContextual("as")) {
      if (!node.specifiers) node.specifiers = [];

      const specifier = this.startNodeAt(
        this.state.lastTokStart,
        this.state.lastTokStartLoc,
      );

      this.next();

      specifier.exported = this.parseIdentifier(true);
      node.specifiers.push(
        this.finishNode(specifier, "ExportNamespaceSpecifier"),
      );
      return true;
    }
    return false;
  }

  maybeParseExportNamedSpecifiers(node: N.Node): boolean {
    if (this.match(tt.braceL)) {
      if (!node.specifiers) node.specifiers = [];
      node.specifiers.push(...this.parseExportSpecifiers());

      node.source = null;
      node.declaration = null;

      return true;
    }
    return false;
  }

  maybeParseExportDeclaration(node: N.Node): boolean {
    if (this.shouldParseExportDeclaration()) {
      if (this.isContextual("async")) {
        const next = this.nextTokenStart();

        // export async;
        if (!this.isUnparsedContextual(next, "function")) {
          this.unexpected(next, tt._function);
        }
      }

      node.specifiers = [];
      node.source = null;
      node.declaration = this.parseExportDeclaration(node);

      return true;
    }
    return false;
  }

  isAsyncFunction(): boolean {
    if (!this.isContextual("async")) return false;
    const next = this.nextTokenStart();
    return (
      !lineBreak.test(this.input.slice(this.state.pos, next)) &&
      this.isUnparsedContextual(next, "function")
    );
  }

  parseExportDefaultExpression(): N.Expression | N.Declaration {
    const expr = this.startNode();

    const isAsync = this.isAsyncFunction();

    if (this.match(tt._function) || isAsync) {
      this.next();
      if (isAsync) {
        this.next();
      }

      return this.parseFunction(
        expr,
        FUNC_STATEMENT | FUNC_NULLABLE_ID,
        isAsync,
      );
    } else if (this.match(tt._class)) {
      return this.parseClass(expr, true, true);
    } else if (this.match(tt.at)) {
      if (
        this.hasPlugin("decorators") &&
        this.getPluginOption("decorators", "decoratorsBeforeExport")
      ) {
        this.raise(this.state.start, Errors.DecoratorBeforeExport);
      }
      this.parseDecorators(false);
      return this.parseClass(expr, true, true);
    } else if (this.match(tt._const) || this.match(tt._var) || this.isLet()) {
      throw this.raise(this.state.start, Errors.UnsupportedDefaultExport);
    } else {
      const res = this.parseMaybeAssign();
      this.semicolon();
      return res;
    }
  }

  // eslint-disable-next-line no-unused-vars
  parseExportDeclaration(node: N.ExportNamedDeclaration): ?N.Declaration {
    return this.parseStatement(null);
  }

  isExportDefaultSpecifier(): boolean {
    if (this.match(tt.name)) {
      const value = this.state.value;
      if (value === "async" || value === "let") {
        return false;
      }
      if (
        (value === "type" || value === "interface") &&
        !this.state.containsEsc
      ) {
        const l = this.lookahead();
        // If we see any variable name other than `from` after `type` keyword,
        // we consider it as flow/typescript type exports
        // note that this approach may fail on some pedantic cases
        // export type from = number
        if (
          (l.type === tt.name && l.value !== "from") ||
          l.type === tt.braceL
        ) {
          this.expectOnePlugin(["flow", "typescript"]);
          return false;
        }
      }
    } else if (!this.match(tt._default)) {
      return false;
    }

    const next = this.nextTokenStart();
    const hasFrom = this.isUnparsedContextual(next, "from");
    if (
      this.input.charCodeAt(next) === charCodes.comma ||
      (this.match(tt.name) && hasFrom)
    ) {
      return true;
    }
    // lookahead again when `export default from` is seen
    if (this.match(tt._default) && hasFrom) {
      const nextAfterFrom = this.input.charCodeAt(
        this.nextTokenStartSince(next + 4),
      );
      return (
        nextAfterFrom === charCodes.quotationMark ||
        nextAfterFrom === charCodes.apostrophe
      );
    }
    return false;
  }

  parseExportFrom(node: N.ExportNamedDeclaration, expect?: boolean): void {
    if (this.eatContextual("from")) {
      node.source = this.parseImportSource();
      this.checkExport(node);
    } else {
      if (expect) {
        this.unexpected();
      } else {
        node.source = null;
      }
    }

    this.semicolon();
  }

  shouldParseExportDeclaration(): boolean {
    if (this.match(tt.at)) {
      this.expectOnePlugin(["decorators", "decorators-legacy"]);
      if (this.hasPlugin("decorators")) {
        if (this.getPluginOption("decorators", "decoratorsBeforeExport")) {
          this.unexpected(this.state.start, Errors.DecoratorBeforeExport);
        } else {
          return true;
        }
      }
    }

    return (
      this.state.type.keyword === "var" ||
      this.state.type.keyword === "const" ||
      this.state.type.keyword === "function" ||
      this.state.type.keyword === "class" ||
      this.isLet() ||
      this.isAsyncFunction()
    );
  }

  checkExport(
    node: N.ExportNamedDeclaration,
    checkNames?: boolean,
    isDefault?: boolean,
    isFrom?: boolean,
  ): void {
    if (checkNames) {
      // Check for duplicate exports
      if (isDefault) {
        // Default exports
        this.checkDuplicateExports(node, "default");
        if (this.hasPlugin("exportDefaultFrom")) {
          const declaration = ((node: any): N.ExportDefaultDeclaration)
            .declaration;
          if (
            declaration.type === "Identifier" &&
            declaration.name === "from" &&
            declaration.end - declaration.start === 4 && // does not contain escape
            !declaration.extra?.parenthesized
          ) {
            this.raise(declaration.start, Errors.ExportDefaultFromAsIdentifier);
          }
        }
      } else if (node.specifiers && node.specifiers.length) {
        // Named exports
        for (const specifier of node.specifiers) {
          this.checkDuplicateExports(specifier, specifier.exported.name);
          // $FlowIgnore
          if (!isFrom && specifier.local) {
            // check for keywords used as local names
            this.checkReservedWord(
              specifier.local.name,
              specifier.local.start,
              true,
              false,
            );
            // check if export is defined
            // $FlowIgnore
            this.scope.checkLocalExport(specifier.local);
          }
        }
      } else if (node.declaration) {
        // Exported declarations
        if (
          node.declaration.type === "FunctionDeclaration" ||
          node.declaration.type === "ClassDeclaration"
        ) {
          const id = node.declaration.id;
          if (!id) throw new Error("Assertion failure");

          this.checkDuplicateExports(node, id.name);
        } else if (node.declaration.type === "VariableDeclaration") {
          for (const declaration of node.declaration.declarations) {
            this.checkDeclaration(declaration.id);
          }
        }
      }
    }

    const currentContextDecorators = this.state.decoratorStack[
      this.state.decoratorStack.length - 1
    ];
    if (currentContextDecorators.length) {
      const isClass =
        node.declaration &&
        (node.declaration.type === "ClassDeclaration" ||
          node.declaration.type === "ClassExpression");
      if (!node.declaration || !isClass) {
        throw this.raise(node.start, Errors.UnsupportedDecoratorExport);
      }
      this.takeDecorators(node.declaration);
    }
  }

  checkDeclaration(node: N.Pattern | N.ObjectProperty): void {
    if (node.type === "Identifier") {
      this.checkDuplicateExports(node, node.name);
    } else if (node.type === "ObjectPattern") {
      for (const prop of node.properties) {
        this.checkDeclaration(prop);
      }
    } else if (node.type === "ArrayPattern") {
      for (const elem of node.elements) {
        if (elem) {
          this.checkDeclaration(elem);
        }
      }
    } else if (node.type === "ObjectProperty") {
      this.checkDeclaration(node.value);
    } else if (node.type === "RestElement") {
      this.checkDeclaration(node.argument);
    } else if (node.type === "AssignmentPattern") {
      this.checkDeclaration(node.left);
    }
  }

  checkDuplicateExports(
    node:
      | N.Identifier
      | N.ExportNamedDeclaration
      | N.ExportSpecifier
      | N.ExportDefaultSpecifier,
    name: string,
  ): void {
    if (this.state.exportedIdentifiers.indexOf(name) > -1) {
      this.raise(
        node.start,
        name === "default"
          ? Errors.DuplicateDefaultExport
          : Errors.DuplicateExport,
        name,
      );
    }
    this.state.exportedIdentifiers.push(name);
  }

  // Parses a comma-separated list of module exports.

  parseExportSpecifiers(): Array<N.ExportSpecifier> {
    const nodes = [];
    let first = true;

    // export { x, y as z } [from '...']
    this.expect(tt.braceL);

    while (!this.eat(tt.braceR)) {
      if (first) {
        first = false;
      } else {
        this.expect(tt.comma);
        if (this.eat(tt.braceR)) break;
      }

      const node = this.startNode();
      node.local = this.parseIdentifier(true);
      node.exported = this.eatContextual("as")
        ? this.parseIdentifier(true)
        : node.local.__clone();
      nodes.push(this.finishNode(node, "ExportSpecifier"));
    }

    return nodes;
  }

  // Parses import declaration.

  parseImport(node: N.Node): N.AnyImport {
    // import '...'
    node.specifiers = [];
    if (!this.match(tt.string)) {
      // check if we have a default import like
      // import React from "react";
      const hasDefault = this.maybeParseDefaultImportSpecifier(node);
      /* we are checking if we do not have a default import, then it is obvious that we need named imports
       * import { get } from "axios";
       * but if we do have a default import
       * we need to check if we have a comma after that and
       * that is where this `|| this.eat` condition comes into play
       */
      const parseNext = !hasDefault || this.eat(tt.comma);
      // if we do have to parse the next set of specifiers, we first check for star imports
      // import React, * from "react";
      const hasStar = parseNext && this.maybeParseStarImportSpecifier(node);
      // now we check if we need to parse the next imports
      // but only if they are not importing * (everything)
      if (parseNext && !hasStar) this.parseNamedImportSpecifiers(node);
      this.expectContextual("from");
    }
    node.source = this.parseImportSource();
    // https://github.com/tc39/proposal-module-attributes
    // parse module attributes if the next token is `with` or ignore and finish the ImportDeclaration node.
    const attributes = this.maybeParseModuleAttributes();
    if (attributes) {
      node.attributes = attributes;
    }
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration");
  }

  parseImportSource(): N.StringLiteral {
    if (!this.match(tt.string)) this.unexpected();
    return this.parseExprAtom();
  }

  // eslint-disable-next-line no-unused-vars
  shouldParseDefaultImport(node: N.ImportDeclaration): boolean {
    return this.match(tt.name);
  }

  parseImportSpecifierLocal(
    node: N.ImportDeclaration,
    specifier: N.Node,
    type: string,
    contextDescription: string,
  ): void {
    specifier.local = this.parseIdentifier();
    this.checkLVal(
      specifier.local,
      BIND_LEXICAL,
      undefined,
      contextDescription,
    );
    node.specifiers.push(this.finishNode(specifier, type));
  }

  maybeParseModuleAttributes() {
    if (this.match(tt._with) && !this.hasPrecedingLineBreak()) {
      this.expectPlugin("moduleAttributes");
      this.next();
    } else {
      if (this.hasPlugin("moduleAttributes")) return [];
      return null;
    }
    const attrs = [];
    const attributes = new Set();
    do {
      // we are trying to parse a node which has the following syntax
      // with type: "json"
      // [with -> keyword], [type -> Identifier], [":" -> token for colon], ["json" -> StringLiteral]
      const node = this.startNode();
      node.key = this.parseIdentifier(true);

      // for now we are only allowing `type` as the only allowed module attribute
      if (node.key.name !== "type") {
        this.raise(
          node.key.start,
          Errors.ModuleAttributeDifferentFromType,
          node.key.name,
        );
      }

      // check if we already have an entry for an attribute
      // if a duplicate entry is found, throw an error
      // for now this logic will come into play only when someone declares `type` twice
      if (attributes.has(node.key.name)) {
        this.raise(
          node.key.start,
          Errors.ModuleAttributesWithDuplicateKeys,
          node.key.name,
        );
      }
      attributes.add(node.key.name);
      this.expect(tt.colon);
      // check if the value set to the module attribute is a string as we only allow string literals
      if (!this.match(tt.string)) {
        throw this.unexpected(
          this.state.start,
          Errors.ModuleAttributeInvalidValue,
        );
      }
      node.value = this.parseLiteral(this.state.value, "StringLiteral");
      this.finishNode(node, "ImportAttribute");
      attrs.push(node);
    } while (this.eat(tt.comma));

    return attrs;
  }

  maybeParseDefaultImportSpecifier(node: N.ImportDeclaration): boolean {
    if (this.shouldParseDefaultImport(node)) {
      // import defaultObj, { x, y as z } from '...'
      this.parseImportSpecifierLocal(
        node,
        this.startNode(),
        "ImportDefaultSpecifier",
        "default import specifier",
      );
      return true;
    }
    return false;
  }

  maybeParseStarImportSpecifier(node: N.ImportDeclaration): boolean {
    if (this.match(tt.star)) {
      const specifier = this.startNode();
      this.next();
      this.expectContextual("as");

      this.parseImportSpecifierLocal(
        node,
        specifier,
        "ImportNamespaceSpecifier",
        "import namespace specifier",
      );
      return true;
    }
    return false;
  }

  parseNamedImportSpecifiers(node: N.ImportDeclaration) {
    let first = true;
    this.expect(tt.braceL);
    while (!this.eat(tt.braceR)) {
      if (first) {
        first = false;
      } else {
        // Detect an attempt to deep destructure
        if (this.eat(tt.colon)) {
          throw this.raise(this.state.start, Errors.DestructureNamedImport);
        }

        this.expect(tt.comma);
        if (this.eat(tt.braceR)) break;
      }

      this.parseImportSpecifier(node);
    }
  }

  parseImportSpecifier(node: N.ImportDeclaration): void {
    const specifier = this.startNode();
    specifier.imported = this.parseIdentifier(true);
    if (this.eatContextual("as")) {
      specifier.local = this.parseIdentifier();
    } else {
      this.checkReservedWord(
        specifier.imported.name,
        specifier.start,
        true,
        true,
      );
      specifier.local = specifier.imported.__clone();
    }
    this.checkLVal(
      specifier.local,
      BIND_LEXICAL,
      undefined,
      "import specifier",
    );
    node.specifiers.push(this.finishNode(specifier, "ImportSpecifier"));
  }
}
