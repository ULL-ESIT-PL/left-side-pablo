<p align="center">
  <a href="https://babeljs.io/">
    <img alt="babel" src="https://raw.githubusercontent.com/babel/logo/master/babel.png" width="546">
  </a>
</p>

# The left-side extension for JavaScript

By Pablo Santana González

## To run the project
Try the extension yourself [by following the instructions in the package published in npm](https://www.npmjs.com/package/babel-plugin-left-side).

## Introduction

This repository contains the source code of @PSantanaGlez13's TFG (Trabajo Fin de Grado/Bachellor's Degree Thesis).

### Background
Originally, in my third year of my degree in CS I was on the subject Procesadores de Lenguajes (Language Processors) in which we (the students) developed a programming language throughout the course. In one of the labs, we implemented assignable functions in said language.

The concept of assignable functions consists in defining functions that, as the name implies, are later assigned to. This binds the signature of the function to a certain value, overriding the normal behaviour of the function, just as it can be seen in the following pseudocode example:

### Example
```
fun foo(bar) {
  return bar
}
foo(20) // 20, default behaviour
foo(20) = "Other value"
foo(19) // 19
foo(20) // "Other value", overriden default behaviour
foo(21) // 21
```
### About the project
This project is an implementation of the assignable functions in JavaScript. Implementing the assignable functions in a real-world programming language (as opposed to the one developed in class) like JavaScript, that has very active community and is constantly being reviewed, poses as a challenge from a language design point of view, since it has to take into consideration the many particularities of the language itself when defining the semantics of this construct. It is also a learning experience in other aspects, such as JavaScript projects and the tools used for their development and the way a programming language is updated.

It started out as a fork of the Babel compiler project. Because of the quantity of packages in the repo (Babel follows a monorepo structure), the build time of the project was long and unnecesary, since the project uses only the parser and the rest are new packages.

## Examples
Check the directory `packages/a-test/in` to see various examples of the extension.

<p align="center">
  The compiler for writing next generation JavaScript.
</p>

<p align="center">
  <a href="https://gitpod.io/#https://github.com/babel/babel"><img alt="Gitpod ready-to-code" src="https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod"></a>
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@babel/core"><img alt="v7 npm Downloads" src="https://img.shields.io/npm/dm/@babel/core.svg?maxAge=43200&label=v7%20downloads"></a>
  <a href="https://www.npmjs.com/package/babel-core"><img alt="v6 npm Downloads" src="https://img.shields.io/npm/dm/babel-core.svg?maxAge=43200&label=v6%20downloads"></a>
</p>
<p align="center">
  <a href="https://travis-ci.com/babel/babel"><img alt="Travis Status" src="https://img.shields.io/travis/com/babel/babel/master.svg?label=travis&maxAge=43200"></a>
  <a href="https://circleci.com/gh/babel/babel"><img alt="CircleCI Status" src="https://img.shields.io/circleci/project/github/babel/babel/master.svg?label=circle&maxAge=43200"></a>
  <a href="https://codecov.io/github/babel/babel"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/babel/babel/master.svg?maxAge=43200"></a>
  <a href="https://slack.babeljs.io/"><img alt="Slack Status" src="https://slack.babeljs.io/badge.svg"></a>
  <a href="https://twitter.com/intent/follow?screen_name=babeljs"><img alt="Follow on Twitter" src="https://img.shields.io/twitter/follow/babeljs.svg?style=social&label=Follow"></a>
</p>

<h2 align="center">Supporting Babel</h2>

<p align="center">
  <a href="#backers"><img alt="Backers on Open Collective" src="https://opencollective.com/babel/backers/badge.svg" /></a>
  <a href="#sponsors"><img alt="Sponsors on Open Collective" src="https://opencollective.com/babel/sponsors/badge.svg" /></a>
  <a href="https://medium.com/friendship-dot-js/i-peeked-into-my-node-modules-directory-and-you-wont-believe-what-happened-next-b89f63d21558"><img alt="Business Strategy Status" src="https://img.shields.io/badge/business%20model-flavortown-green.svg"></a>
</p>

Babel (pronounced ["babble"](https://soundcloud.com/sebmck/how-to-pronounce-babel))  is a community-driven project used by many companies and projects, and is maintained by a group of [volunteers](https://babeljs.io/team). If you'd like to help support the future of the project, please consider:

- Giving developer time on the project. (Message us on [Twitter](https://twitter.com/babeljs) or [Slack](https://slack.babeljs.io/) for guidance!)
- Giving funds by becoming a sponsor on [Open Collective](https://opencollective.com/babel) or [Patreon](https://www.patreon.com/henryzhu)!

## Sponsors

Our top sponsors are shown below! [[Become a sponsor](https://opencollective.com/babel#sponsor)]

<a href="https://opencollective.com/babel/sponsor/0/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/babel/sponsor/1/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/babel/sponsor/2/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/babel/sponsor/3/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/babel/sponsor/4/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/4/avatar.svg"></a>
 <a href="https://opencollective.com/babel/sponsor/5/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/5/avatar.svg"></a>
  <a href="https://opencollective.com/babel/sponsor/6/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/6/avatar.svg"></a>
  <a href="https://opencollective.com/babel/sponsor/7/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/7/avatar.svg"></a>
  <a href="https://opencollective.com/babel/sponsor/8/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/8/avatar.svg"></a>
  <a href="https://opencollective.com/babel/sponsor/9/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/9/avatar.svg"></a>
  <a href="https://opencollective.com/babel/sponsor/10/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/10/avatar.svg"></a>
  <a href="https://opencollective.com/babel/sponsor/11/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/11/avatar.svg"></a>
  <a href="https://opencollective.com/babel/sponsor/12/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/12/avatar.svg"></a>
  <a href="https://opencollective.com/babel/sponsor/13/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/13/avatar.svg"></a>
  <a href="https://opencollective.com/babel/sponsor/14/website" target="_blank"><img src="https://opencollective.com/babel/sponsor/14/avatar.svg"></a>

## Intro

Babel is a tool that helps you write code in the latest version of JavaScript. When your supported environments don't support certain features natively, Babel will help you compile those features down to a supported version.

**In**

```js
// ES2015 arrow function
[1, 2, 3].map((n) => n + 1);
```

**Out**

```js
[1, 2, 3].map(function(n) {
  return n + 1;
});
```

Try it out at our [REPL](https://babeljs.io/repl/build/master#?code_lz=NoRgNATGDMC6B0BbAhgBwBQDsAEBeAfNjgNTYgCUA3EA&lineWrap=true&presets=es2015%2Ces2016%2Ces2017&version=7.0.0-beta.2).

## FAQ

### Who maintains Babel?

Mostly a handful of volunteers, funded by you! Please check out our [team page](https://babeljs.io/team)!

### Is there a Babel song?

I'm so glad you asked: [Hallelujah —— In Praise of Babel](SONG.md) by [@angus-c](https://github.com/angus-c), [audio version](https://youtu.be/40abpedBKK8) by [@swyx](https://twitter.com/@swyx). Tweet us your recordings!

### Looking for support?

For questions and support please join our [Slack Community](https://slack.babeljs.io/) (you can sign-up [here](https://slack.babeljs.io/) for an invite), ask a question on [Stack Overflow](https://stackoverflow.com/questions/tagged/babeljs), or ping us on [Twitter](https://twitter.com/babeljs).

### Where are the docs?

Check out our website: [babeljs.io](https://babeljs.io/), and report issues/features at [babel/website](https://github.com/babel/website/issues).

### Want to report a bug or request a feature?

Please read through our [CONTRIBUTING.md](CONTRIBUTING.md) and fill out the issue template at [babel/issues](https://github.com/babel/babel/issues)!

### Want to contribute to Babel?

Check out:

- Our [#development](https://babeljs.slack.com/messages/development) Slack channel and say hi ([signup](https://slack.babeljs.io))!
- Issues with the [good first issue](https://github.com/babel/babel/labels/good%20first%20issue) and [help wanted](https://github.com/babel/babel/labels/help%20wanted) label. We suggest also looking at the [closed ones](https://github.com/babel/babel/issues?utf8=%E2%9C%93&q=is%3Aclosed+label%3A%22good+first+issue%22) to get a sense of the kinds of issues you can tackle.

Some resources:

- Our [CONTRIBUTING.md](CONTRIBUTING.md) to get started with setting up the repo.
- Our discussions/notes/roadmap: [babel/notes](https://github.com/babel/notes)
- Our progress on TC39 proposals: [babel/proposals](https://github.com/babel/proposals)
- Our blog which contains release posts and explanations: [/blog](https://babeljs.io/blog)
- Our videos page with talks about open source and Babel: [/videos](https://babeljs.io/videos)
- Our [podcast](https://podcast.babeljs.io)

### How is the repo structured?

The Babel repo is managed as a [monorepo](doc/design/monorepo.md) that is composed of many [npm packages](packages/README.md).

## License

[MIT](LICENSE)
