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



export const add = (context: Graph, node: NodeId, data: object = {}): Node => {
  if (!(node in context.nodes))
    context.nodes[node] = { ...data, id: node }

  return context.nodes[node]
}



export const del = (context: Graph, node: NodeId): void => {
  if (!(node in context.nodes))
    throw new Error(`No Such Node - (${node})`)

  edgesOf(context, node)
    .forEach(edge => unlink(context, edge[FROM], edge[TO]))

  const { [node]: dead, ...others } = context.nodes
  context.nodes = others
}



export const link = (context: Graph, from: NodeId, to: NodeId, cost: number, data: object = {}): Edge => {
  const notfound = [from, to].filter(node => !(node in context.nodes))

  if (notfound.length)
    throw new Error(`No Such Node - (${notfound.join(', ')})`)

  try {
    return edgeFor(context, from, to)
  }
  catch (error) {
    const edge: Edge = { ...data, from, to, cost }
    context.edges.push(edge)
    return edge
  }
}



export const unlink = (context: Graph, from: NodeId, to: NodeId): void => {
  const edge: Edge = edgeFor(context, from, to)
  context.edges.splice(context.edges.indexOf(edge), 1)
}



export const edgesOf = (context: Graph, node: NodeId, direction?: Direction): Edge[] => {
  if (!(node in context.nodes))
    throw new Error(`No Such Node - (${node})`)

  if (!direction)
    return context.edges.filter(edge => edge[FROM] === node || edge[TO] === node)

  return context.edges.filter(edge => edge[direction] === node)
}



export const edgeFor = (context: Graph, from: NodeId, to: NodeId): Edge => {
  const edge = edgesOf(context, from).find(edge => edge[TO] === to)

  if (!edge)
    throw new Error(`No Such Route – (${from} -> ${to})`)

  return edge
}



export const routeFor = (context: Graph, nodes: NodeId[]): Route => (
  nodes.slice(0, -1).reduce<Route>((route, node, index) => (
    [...route, edgeFor(context, node, nodes[index + 1])]
  ), [])
)



export const costOf = (route: Route): number => (
  route.reduce((sum, edge) => sum + edge.cost, 0)
)



const NOOP = () => true
let SAFEGUARD: number = /* troy& */ 0x4bed

export const routesFor = (context: Graph, from: NodeId, to: NodeId, filter: Filter = NOOP, occurences: number = 1): Route[] => {
  const solutions: Route[] = []
  const candidates: Route[] = edgesOf(context, from, FROM)
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
    if (now.to !== to || occurences > 1)
      edgesOf(context, now[TO], FROM)

        // compute absolute path
        .map(edge => [...candidate, edge])

        // proceed if the path is unique or we looping
        .filter(route => (
          route
            .filter((e, i, a) => a.indexOf(e) === i)
            .every(uniq => route.filter(edge => edge === uniq).length <= occurences + 1)
        ))

        // put in storage
        .forEach(route => candidates.push(route))
  }

  if (!solutions.length)
    throw new Error(`No Such Route – (${from} -> ${to})`)

  return solutions
}
