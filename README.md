# prasae

prasae is an experimental word tokenizer for ASEAN language written in ES2015 and using Flow for statically checking type.

prasae is going to be merge to wordcut.js in the future


## Experiment

````javascript
const fs = require('fs')
const Tokenizer = require('./dist/tokenizer').Tokenizer
const PrefixTree = require('./dist/prefixtree').PrefixTree
const wordlist = fs.readFileSync("bigthai.txt", { encoding: "UTF-8" })
      .split(/[\r\n]+/)
      .filter((w) => w.length > 1)
      .map((w) => [w, true])
const tree = new PrefixTree(wordlist)
const tokenizer = new Tokenizer(tree)

fs.readFileSync("x.txt", { encoding: "UTF-8" })
  .split(/[\r\n]+/)
  .forEach((line) => console.log(tokenizer.tokenize(line).join("|")))
````