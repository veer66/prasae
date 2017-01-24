const expect = require('chai').expect
const create_prefix_tree = require("../dist/prefixtree").create_prefix_tree

describe("PrefixTree", () => {
    it("should be able to handle one char", () => {
        tree = create_prefix_tree([["A", 10]])
        expect(tree.lookup(0, 0, "A")).to.deep.equal([0, true, 10])
        expect(tree.lookup(0, 0, "C")).to.be.null
    })

    it("should be able to handle two chars", () => {
        tree = create_prefix_tree([["AB", 20]])
        expect(tree.lookup(0, 0, "A")).to.deep.equal([0, false, null])
        expect(tree.lookup(0, 1, "B")).to.deep.equal([0, true, 20])
    })

    it("should be able to handle two words", () => {
        tree = create_prefix_tree([["A", 10], ["AB", 20]])
        expect(tree.lookup(0, 0, "A")).to.deep.equal([0, true, 10])
        expect(tree.lookup(0, 1, "B")).to.deep.equal([1, true, 20])
    })

    it("should be able to handle two words desc", () => {
        tree = create_prefix_tree([["AB", 20], ["A", 10]])
        expect(tree.lookup(0, 0, "A")).to.deep.equal([0, true, 10])
        expect(tree.lookup(0, 1, "B")).to.deep.equal([1, true, 20])
    })

})