const expect = require('chai').expect
const PrefixTree = require("../dist/prefixtree").PrefixTree
const Tokenizer = require("../dist/tokenizer.js").Tokenizer

describe("Tokenizer", () => {
  it("should be able to tokenize กากา", () => {
    const tree = new PrefixTree([["กา", true]])
    const tokenizer = new Tokenizer(tree)
    expect(tokenizer.tokenize("กากา")).to.deep.equal(["กา","กา"])
  })

  it("should be able to tokenize กามกา", () => {
    const tree = new PrefixTree([["กา", true], ["กาม", true]])
    const tokenizer = new Tokenizer(tree)
    expect(tokenizer.tokenize("กามกา")).to.deep.equal(["กาม","กา"])
  })

  it("should be able to tokenize by space", () => {
    const tree = new PrefixTree([["กา", true], ["กาม", true]])
    const tokenizer = new Tokenizer(tree)
    expect(tokenizer.tokenize("กข คง")).to.deep.equal(["กข"," ", "คง"])
  })

  it("should be able to tokenize by latin alphabets", () => {
    const tree = new PrefixTree([["กา", true], ["กาม", true]])
    const tokenizer = new Tokenizer(tree)
    expect(tokenizer.tokenize("กขABคง")).to.deep.equal(["กข","AB", "คง"])
  })

  it("should be able to tokenize by overlap", () => {
    const tree = new PrefixTree([["มา", true], ["ตา", true], ["มาตรา", true]])
    const tokenizer = new Tokenizer(tree)
    expect(tokenizer.tokenize("มาตรา")).to.deep.equal(["มาตรา"])
  })

})
