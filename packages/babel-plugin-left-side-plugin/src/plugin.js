//const parser = require("../../babel-parser/lib");
const parser = require("@ull-esit-pl/parser-left-side"); // What a name!
const types = require("@babel/types");
const template = require("@babel/template").default;
let { inspect } = require("util");
ins = (x) => inspect(x, { depth: null });

// Assuming that the left side of an assignment is a CallExpression, checking if the callee is an assignable function can not be done
// at compile time.
// f(z) = 4 compile time error? Done
// f(x)(y) = 5;  run time error if f(x) is not assignable?
// a[x](y) = 5;  run time if a[x] is not asignable?
// obj[x][y](z) = 5;  run time error if obj[x][y] is not an assignable function?

// To avoid repeating code in FunctionDeclaration and FunctionExpression. Transforms the assignable function syntax to valid JS.
// Returns a CallExpression node with the functionObject call. "function foo() {}" -> "foo = functionObject(function foo() {})"
function changeAssignableFunctionToValid(node) {
  node.assignable = false;
  const functionObjectId = types.identifier("functionObject");
  const funId = node.id;
  //node.id = null; // Casiano Why? Is not better to keep the Id?
  // Replace the FunctionDeclaration with FunctionExpression.
  const funAsExpr = types.functionExpression(
    funId,
    node.params,
    node.body,
  );
  const callExpression = types.callExpression(functionObjectId, [funAsExpr]);
  return [funId, callExpression];
}


// TODO: export only used functions
const SUPPORT_TEMPLATE = template(
  'const {assign, mAssign, functionObject, FunctionObject, Storage} = require("@ull-esit-pl/babel-plugin-left-side-support");',
)();

const assignTemplate = template('mAssign(FUN, ARGS, RVALUE);');

// TODO:  Support expressions like f(2, 3)()(5) = 9 => mAssign(f, [[2, 3], [], [5]], 9)
module.exports = function leftSidePlugin(babel) {
  return {
    parserOverride(code, opts) {
      return parser.parse(code, opts);
    },
    visitor: {
      AssignmentExpression(path) {
        const node = path.node;
        const left = node.left;
        if (node.operator == "=" && left.type == "CallExpression") {
          let RVALUE = node.right;
          let errorArgs = false;
          //checkIsAssignableFunction(path, left);

          let callee = left.callee;
          let argumentList = [];
          if (left.arguments.length !== 1) {
            argumentList = [ types.arrayExpression(left.arguments) ];
             errorArgs = true;
          }
          else argumentList = [ left.arguments.at(-1) ];

          while (callee.type == "CallExpression") {
            //console.log(callee.type);
            if (callee.arguments.length !== 1) {
              errorArgs = true;
              argumentList.unshift(types.arrayExpression(callee.arguments));
            }
            else argumentList.unshift(callee.arguments.at(-1));
            callee = callee.callee;
          }
          let FUN = callee;
          //console.log(FUN.type);
          let ARGS = types.arrayExpression(argumentList);
          let ast = assignTemplate({ FUN, ARGS, RVALUE }).expression;
          //console.log("AST", ast);
          if (errorArgs) {
            // console.log(argumentList);
            //throw new Error(`TypeError: Illegal call expression assignment at line ${callee.loc.start.line} column ${callee.loc.start.column}. Assignable functions only support one argument.`);
          }
          path.replaceWith(ast);
        }
      },
      FunctionDeclaration(path) {
        const node = path.node;
        if (node.assignable) {
          const [funId, callExpression] = changeAssignableFunctionToValid(node);
          const varDeclarator = types.variableDeclarator(funId, callExpression);
          path.replaceWith(types.variableDeclaration("const", [varDeclarator]));
        }
      },
      FunctionExpression(path) {
        const node = path.node;
        if (node.assignable) {
          const [_, callExpression] = changeAssignableFunctionToValid(node);
          path.replaceWith(callExpression);
        }
      },
      Program(path) {
        const node = path.node;
        // Perhaps checking when it's actually needed? Write on exit if an assignable function was created.
        node.body.unshift(SUPPORT_TEMPLATE);
      },
    },
  };
};

/*
module.exports = function leftSidePlugin(babel) {
  return {
    parserOverride(code, opts) {
      return parser.parse(code, opts);
    },
    visitor: {
      AssignmentExpression(path) {
        const node = path.node;
        const left = node.left;
        if (node.operator == "=" && node.left.type == "CallExpression") {
          //checkIsAssignableFunction(path, left);

          let CALLEE = left.callee;
          let RVALUE = node.right;
          // TODO: Support multiple arguments
          if (left.arguments.length !== 1) {
            throw new Error(`TypeError: Illegal call expression assignment to "${CALLEE.name}" at line ${CALLEE.loc.start.line} column ${CALLEE.loc.start.column}. Assignable functions only support one argument.`);
          }
          let ARGS = types.arrayExpression(left.arguments);
          let ast = assignTemplate({ CALLEE, ARGS, RVALUE });
          let nestedCalls = [ assignTemplate({ CALLEE, ARGS, RVALUE }).expression ];

          while (CALLEE.type == "CallExpression") {
            RVALUE = CALLEE;
            ARGS = types.arrayExpression(CALLEE.arguments);
            CALLEE = CALLEE.callee;
            nestedCalls.unshift(assignTemplate({ CALLEE, ARGS, RVALUE }).expression);
          }
          if (nestedCalls.length == 1) {
            path.replaceWith(nestedCalls[0]);
          } else {
            path.replaceWith(types.sequenceExpression(nestedCalls));
          }
        }
      },
      FunctionDeclaration(path) {
        const node = path.node;
        if (node.assignable) {
          const [funId, callExpression] = changeAssignableFunctionToValid(node);
          const varDeclarator = types.variableDeclarator(funId, callExpression);
          path.replaceWith(types.variableDeclaration("const", [varDeclarator]));
        }
      },
      FunctionExpression(path) {
        const node = path.node;
        if (node.assignable) {
          const [_, callExpression] = changeAssignableFunctionToValid(node);
          path.replaceWith(callExpression);
        }
      },
      Program(path) {
        const node = path.node;
        // Perhaps checking when it's actually needed? Write on exit if an assignable function was created.
        node.body.unshift(SUPPORT_TEMPLATE);
      },
    },
  };
};
*/
