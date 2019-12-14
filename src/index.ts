export const FROM = 'from'
export const TO = 'to'

export type Node = string

export type Edge = {
  [FROM]: Node,
  [TO]: Node,
  cost: number,
}

export type Route = Edge[]

export type Graph = {
  nodes: Node[]
  edges: Edge[]
}

export type Direction = (typeof FROM | typeof TO)



let graph: Graph



export const use = (context: Graph): void => {
  graph = context
}



export const edgesOf = (node: Node, direction?: Direction): Edge[] => {
  if (!graph.nodes.includes(node))
    throw new Error(`No Such Node - (${node})`)

  if (!direction)
    return graph.edges.filter(edge => edge[FROM] === node || edge[TO] === node)

  return graph.edges.filter(edge => edge[direction] === node)
}



export const edgeFor = (from: Node, to: Node): Edge => {
  const edge = edgesOf(from).find(edge => edge[TO] === to)

  if (!edge)
    throw new Error(`No Such Route – (${from} -> ${to})`)

  return edge
}
