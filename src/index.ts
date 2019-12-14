
export type Node = string

export type Edge = {
  from: Node,
  to: Node,
  cost: number,
}

export type Route = Edge[]

export type Graph = {
  nodes: Node[]
  edges: Edge[]
}
