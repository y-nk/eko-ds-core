export const FROM = 'from'
export const TO = 'to'

export type NodeId = string

export type Node = {
  id: NodeId
}

export type Edge = {
  [FROM]: NodeId,
  [TO]: NodeId,
  cost: number,
}

export type Route = Edge[]

export type Graph = {
  nodes: Record<NodeId, Node>
  edges: Edge[]
}

export type Direction = (typeof FROM | typeof TO)

type Filter = (route: Route) => boolean



let graph: Graph



export const use = (context: Graph): void => {
  graph = context
}



export const edgesOf = (node: NodeId, direction?: Direction): Edge[] => {
  if (!(node in graph.nodes))
    throw new Error(`No Such Node - (${node})`)

  if (!direction)
    return graph.edges.filter(edge => edge[FROM] === node || edge[TO] === node)

  return graph.edges.filter(edge => edge[direction] === node)
}



export const edgeFor = (from: NodeId, to: NodeId): Edge => {
  const edge = edgesOf(from).find(edge => edge[TO] === to)

  if (!edge)
    throw new Error(`No Such Route – (${from} -> ${to})`)

  return edge
}



export const routeFor = (nodes: NodeId[]): Route => (
  nodes.slice(0, -1).reduce<Route>((route, node, index) => (
    [...route, edgeFor(node, nodes[index + 1])]
  ), [])
)



export const costOf = (route: Route): number => (
  route.reduce((sum, edge) => sum + edge.cost, 0)
)



const NOOP = () => true
let SAFEGUARD: number = /* troy& */ 0x4bed

export const routesFor = (from: NodeId, to: NodeId, filter: Filter = NOOP, looping?: boolean): Route[] => {
  const solutions: Route[] = []
  const candidates: Route[] = edgesOf(from, FROM)
    .map(from => [from])

  /*
    we're not going recursive, instead we use a queue to process candidates.
    candidates are taken out for testing, and new candidates are pushed in if found
    repeat until the queue is empty
  */

  let safeguard = 0
  while(candidates.length && safeguard++ < SAFEGUARD) {
    const candidate = candidates.shift()!
    let now = candidate[candidate.length - 1]

    // we pass "0 cost" or "userland-rejected" candidates
    if (costOf(candidate) === 0 || !filter(candidate))
      continue

    // if candidate matches destination
    if (now[TO] === to)
      solutions.push(candidate)

    // if we didn't reach or wanna explore further
    if (now[TO] !== to || looping)
      edgesOf(now[TO], FROM)

        // compute absolute path
        .map(edge => [...candidate, edge])

        // proceed if the path is unique or we looping
        .filter(route => (
          route.length === route.filter((e, i, a) => a.indexOf(e) === i).length
          || looping
        ))

        // put in storage
        .forEach(route => candidates.push(route))
  }

  if (!solutions.length)
    throw new Error(`No Such Route – (${from} -> ${to})`)

  return solutions
}
