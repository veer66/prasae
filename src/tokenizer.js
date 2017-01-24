// @flow

import type {PrefixTree} from "./prefixtree.js";

const INIT:number   = 1
const DICT:number   = 2
const UNK:number    = 3
const LATIN:number  = 4
const PUNC:number   = 5

const EDGE_P:number    = 0
const EDGE_TYPE:number = 1
const EDGE_W:number    = 2
const EDGE_UNK:number  = 3

type Edge = [number, number, number, number];

function is_better_than(e0: Edge, e1:Edge) {
  if (e0[EDGE_UNK] < e1[EDGE_UNK]) return true
  if (e0[EDGE_UNK] > e1[EDGE_UNK]) return false
  if (e0[EDGE_W] < e1[EDGE_W]) return true
  if (e0[EDGE_W] > e1[EDGE_W]) return false

  if (e0[EDGE_TYPE] != UNK && e1[EDGE_TYPE] == UNK) return true
  return false
}

class EdgeBuildingContext {
  text: string
  path: Array<Edge>
  ch: string
  i: number
  left_boundary: number
  best_edge: ?Edge
  
  constructor(text: string) {
    this.text = text
    this.path = new Array(text.length + 1)
    this.left_boundary = 0
  }
}
// s, node_id, offset, final
type Pointer = [number, number, number, boolean]
class DictEdgeBuilder {
  tree: PrefixTree
  pointers: Array<Pointer>
  n: number
  max: number
  
  constructor(tree: PrefixTree) {
    this.tree = tree
    this.n = 0
    this.max = 0xFF
    this.pointers = new Array(this.max)    
  }

  build(context: EdgeBuildingContext): ?Edge {
    if (this.n == this.max) {
      this.max *= 2
      const old_pointers = this.pointers
      this.pointers = new Array(this.max)
      for (let i = 0; i < this.n; i++) {
        this.pointers[i] = old_pointers[i]
      }
    }
    
    this.pointers[this.n] = [context.i,0,0,false]
    this.n++

    let best_edge = null
    let j = 0
    
    for (let i = 0; i < this.n; i++) {
      const [s, node_id, offset, _is_final] = this.pointers[i]
      const child = this.tree.lookup(node_id, offset, context.ch)
      if (child) {
        let pointer = this.pointers[j]
        const [child_id, offset, is_final] = child
        pointer[0] = s
        pointer[1] = child_id
        pointer[2] = offset + 1
        pointer[3] = is_final

        if (is_final) {
          const source = context.path[s]
          const edge = [s, DICT, source[EDGE_W] + 1, source[EDGE_UNK]]
          if (best_edge == null || is_better_than(edge, best_edge))
            best_edge = edge
        }
        
        j++
      }
    }
    this.n = j
    return best_edge
  }
}

class UnkEdgeBuilder {
  build(context: EdgeBuildingContext): ?Edge {
    if (context.best_edge != null) return null
    const p = context.left_boundary
    const source = context.path[p]
    return [p, UNK, source[EDGE_W] + 1, source[EDGE_UNK] + 1]
  }
}

interface EdgeBuilder {
  build(EdgeBuildingContext): ?Edge
}

function build_path(edge_builders, text) {
  let context = new EdgeBuildingContext(text)
  context.path[0] = [0,INIT,0,0]
  for (let i = 0; i < text.length; i++) {
    context.i = i
    context.ch = text[i]
    context.best_edge = null

    edge_builders.forEach((builder) => {
      const edge = builder.build(context)
      if (context.best_edge == null ||
          (edge && is_better_than(edge, context.best_edge)))
        context.best_edge = edge
    })

    if (context.best_edge == null) throw "best_edge cannot be null here"

    if (context.best_edge.edge_type != UNK)
      context.left_boundary = i + 1

    context.path[i + 1] = context.best_edge
  }
  return context.path
}

class TextRange {
  s: number
  e: number
  constructor(s, e) {
    this.s = s
    this.e = e
  }

  substring(text) {
    return text.substring(this.s, this.e)
  }
}

function path_to_ranges(path: Array<Edge>) {
  let e = path.length - 1
  let ranges: Array<TextRange> = []
  while (e > 0) {
    const s = path[e][EDGE_P]
    ranges.push(new TextRange(s, e))
    e = s
  }
  ranges.reverse()
  return ranges
}

function ranges_to_tokens(text, ranges) {
  return ranges.map((r) => r.substring(text))
}

exports.Tokenizer = class {
  factories: Array<()=>EdgeBuilder>
  constructor(tree: PrefixTree) {
    this.factories = [() => new DictEdgeBuilder(tree),
                      () => new UnkEdgeBuilder()]
  }

  tokenize(text: string) {
    let edge_builders = this.factories.map((factory) => factory());
    const path = build_path(edge_builders, text)
    const ranges = path_to_ranges(path)

    return ranges_to_tokens(text, ranges)
  }
}
