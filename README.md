# eko-ds-core

SDK-ish package with business logic regarding eko delivery service.

## How to use

- "Because it's a test" requirements:
  ```
  git clone https://github.com/y-nk/eko-ds-core
  cd eko-ds-core
  npm run local
  ```

- installation: `npm install eko-ds-core` // `npm link eko-ds-core`

- import : `import * as ekods from 'eko-ds-core'`

## Design principles

- data structure should remain as pure as possible
- computation functions should be as pure as possible

## Data structures

### Node requirements:

```ts
type NodeId = string

interface Node {
  id: NodeId
}
```

Nodes are simple object, so they can be built up on. One could imagine the Node being a DB record, coming with more informations.

### Edge requirements:

```ts
interface Edge {
  from: NodeId
  to: NodeId
  cost: number
}
```

Ideally, Edges should be separated from cost and a _"WeightedEdge"_ should be built on top, but as this is a test and we don't know the nature of the object, we'll assume we can embed the cost in an Edge.

- Route requirements:

```ts
type Route = Edge[]
```

## API

- `edgesOf = (node: NodeId): Edge[]`: find all the edges which starts with node
- `edgeFor = (from: NodeId, to: NodeId): Edge`: returns the exact edge for a `from/to` tuple
- `routeFor = (nodes: NodeId[]): Route`: convert an array of node ids to its corresponding route
- `costOf = (route: Route): number`: calculates the cost for the provided route
- `routesFor = (from: NodeId, to: NodeId, filter: Filter = NOOP, occurences: number = 1): Route[]`: computes all possible routes for a given `from/to` tuple

---

## Other architecture considered:

### Design principle

- object oriented
- a Route is an object that contains a path
- an Edge is a Route with path.length === 1

### Data structures

#### Node requirements:

```ts
type NodeId = string

interface Node {
  id: NodeId
}
```

#### Edge/Route requirements:

```ts
interface Traversable {
  readonly from: NodeId
  readonly to: NodeId
  readonly cost: number

  path: Traversable[]
}

class Edge implements Traversable {
  readonly get path(): Traversable[] { return [this] }

  constructor(
    readonly from: NodeId,
    readonly to: NodeId,
    readonly cost: number = 0
  ) {}
}

class Route implements Traversable {
  readonly get from(): NodeId { return this.path[0].from }
  readonly get to(): NodeId { return this.path[this.path.length - 1].to }
  readonly get cost(): number { return costFor(this.path) }

  constructor(readonly path: Traversable[])
}
```

### Status: rejected

Although this structure is quite appealing, the major reasons for rejections include:
- infinite number of nesting in `path`, which could lead to heavy computation since we'd need to decapsulate each `Traversable` into its own `path` in some calculations
- not easily serializable (due to recursive structure in `Edge.path`)
- requires a lot of object construction.
