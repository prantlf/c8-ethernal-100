# C8 - Ethernal 100 Coverage

Demonstrates how all coverage stats computed by [c8] remain 100 if excludeAfterRemap is set to true. Contains files from the [original project], which need only [c8] to test.

How to test it:

    # install dependencies and prepare coverage/tmp/out.json
    npm ci
    # run report with no exclusions
    npx c8 report
    # run report excluding src/codejar and src/prism
    npm c8 report -a

`npx c8 report` reveals an incomplete coverage in `script-editor.js`, among other files:

    File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
    --------------------|---------|----------|---------|---------|-------------------
      script-editor.js  |   96.84 |      100 |     100 |   96.84 | 71-76
      ...

`npm c8 report -a` excludes other files with missing coverage, but the remaining `script-editor.js` is reported with the complete coverage:

    File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
    --------------------|---------|----------|---------|---------|-------------------
      script-editor.js  |     100 |      100 |     100 |     100 |
      ...

## Project Description

This project demonstrates computing the test code coverage only for a part of sources. The source files are located in the `src` directory:

    src
    ├── bundled-engine.js
    ├── codejar
    │   └── codejar.js
    ├── graph.js
    ├── index.js
    ├── prism
    │   ├── prism-core.js
    │   ├── prism-graphviz.js
    │   ├── prism-line-highlight.js
    │   ├── prism-line-numbers.js
    │   └── prism-match-braces.js
    ├── renderer.js
    ├── script-editor.js
    └── separate-engine.js

The minified bundles with source maps are located in the `dist` directory:

    dist
    ├── index-bundled.min.js
    ├── index-bundled.min.js.map
    ├── index.min.js
    ├── index.min.js.map
    ├── renderer.min.js
    └── renderer.min.js.map

The minified bundles refer to their source maps on their last line, for example, from `index.min.js`:

    //# sourceMappingURL=index.min.js.map

The source map files include relative source file paths from `dist` to `src`, for example: `../src/graph.js`.

The text code coverage produced using [Puppeteer Coverage API] is saved in `data/out.json`, where the absolute paths to the project root are replaced with `$$$CWD$$$`. The script `data/prepare.js`, which is executed during the `prepare` phase of `npm ci`, reads the JSON file, replaces the `$$$CWD$$$` strings with the absolute path to the current project root and writes the result to `converage/tmp/out.json`. This simulates the state after collecting the test coverage in the original project.

The [original project] can be used to demonstrate the problem too:

    git clone https://github.com/prantlf/graphviz-webcomponent
    cd graphviz-webcomponent
    git checkout c8-ethernal-100-coverage
    npm i -g pnpm
    pnpm i
    npm test
    npx c8 report -a

## Test with No Exclusions

The exclusions from package.json do not apply, because they do not match the paths to the bundles loaded by the test pages:

    "c8": {
      "exclude": [
        "src/codejar",
        "src/prism"
      ],
      ...
    }

The report includes all files, as expected:

    ❯ npx c8 report
    -------------------------------------------------|---------|----------|---------|---------|-------------------
    File                                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
    -------------------------------------------------|---------|----------|---------|---------|-------------------
    All files                                        |   90.74 |    67.85 |   47.46 |   90.74 |
     ...s+wasm@2.8.0/node_modules/@hpcc-js/wasm/dist |     100 |    59.16 |   40.68 |     100 |
      graphviz.js                                    |     100 |    59.16 |   40.68 |     100 | 1
     src                                             |    98.4 |      100 |     100 |    98.4 |
      bundled-engine.js                              |     100 |      100 |     100 |     100 |
      graph.js                                       |     100 |      100 |     100 |     100 |
      renderer.js                                    |     100 |      100 |     100 |     100 |
      script-editor.js                               |   96.84 |      100 |     100 |   96.84 | 71-76
      separate-engine.js                             |     100 |      100 |     100 |     100 |
     src/codejar                                     |     100 |       70 |      30 |     100 |
      codejar.js                                     |     100 |       70 |      30 |     100 | 4-17
     src/prism                                       |   83.56 |    78.72 |   59.25 |   83.56 |
      prism-core.js                                  |   78.75 |    73.13 |   68.42 |   78.75 | ...48-252,322-325
      prism-graphviz.js                              |     100 |      100 |     100 |     100 |
      prism-line-numbers.js                          |   98.19 |    86.66 |      75 |   98.19 | 147-149
      prism-match-braces.js                          |   82.58 |      100 |       0 |   82.58 | ...53,57-61,65-75
    -------------------------------------------------|---------|----------|---------|---------|-------------------
    ERROR: Coverage for lines (90.74%) does not meet global threshold (100%)
    ERROR: Coverage for functions (47.46%) does not meet global threshold (100%)
    ERROR: Coverage for branches (67.85%) does not meet global threshold (100%)
    ERROR: Coverage for statements (90.74%) does not meet global threshold (100%)

Note the following line:

      script-editor.js                               |   96.84 |      100 |     100 |   96.84 | 71-76


## Test with Exclusions

The exclusions from package.json do apply, because the `-a` command-line argument makes `c8` match the excluded paths to sources from the source maps, as if `excludeAfterRemap` was set to `true` in `package.json`:

    "c8": {
      "excludeAfterRemap": true,
      "exclude": [
        "src/codejar",
        "src/prism"
      ],
      ...
    }

The report doesn't include excluded files, as expected, but the code coverage of the remaining files is always 100, also for files, have obviously less code coverages, as tested by disabling the exclusions:

    ❯ npx c8 report -a
    --------------------|---------|----------|---------|---------|-------------------
    File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
    --------------------|---------|----------|---------|---------|-------------------
    All files           |     100 |      100 |     100 |     100 |
     bundled-engine.js  |     100 |      100 |     100 |     100 |
     graph.js           |     100 |      100 |     100 |     100 |
     renderer.js        |     100 |      100 |     100 |     100 |
     script-editor.js   |     100 |      100 |     100 |     100 |
     separate-engine.js |     100 |      100 |     100 |     100 |
    --------------------|---------|----------|---------|---------|-------------------

Note the following line:

     script-editor.js   |     100 |      100 |     100 |     100 |

## License

Copyright (c) 2023 Ferdinand Prantl

Licensed under the MIT license.

[original project]: https://github.com/prantlf/graphviz-webcomponent
[c8]: https://github.com/bcoe/c8
[Puppeteer Coverage API]: https://pptr.dev/api/puppeteer.coverage
