import { load } from '~/mocks/load'
import { Graph, edgesOf, edgeFor, routeFor } from '@/index'

export default () => describe('utilities', () => {
  let graph: Graph

  test('load data', async () => {
    graph = await load('./mocks/db.csv')

    expect(graph.nodes.length).not.toBe(0)
    expect(graph.edges.length).not.toBe(0)
  })

  test('find edges of a starting point (valid)', () => {
    expect(edgesOf(graph, 'A', 'from')).toEqual([
      expect.objectContaining({ from: 'A', to: 'B' }),
      expect.objectContaining({ from: 'A', to: 'C' }),
      expect.objectContaining({ from: 'A', to: 'D' }),
    ])
  })

  test('find edges of a starting point (invalid)', () => {
    expect(() => edgesOf(graph, 'Z'))
      .toThrowError(/No Such Node/)
  })

  test('find direct edge between 2 nodes (valid)', () => {
    expect(edgeFor(graph, 'A', 'B')).toEqual({ from: 'A', to: 'B', cost: 1 })
  })

  test('find direct edge between 2 nodes (invalid)', () => {
    expect(() => edgeFor(graph, 'A', 'F'))
      .toThrowError(/No Such Route/)
  })

  test('convert node[] to edge[] (valid)', () => {
    expect(routeFor(graph, ['A', 'B', 'E'])).toEqual([
      expect.objectContaining({ from: 'A', to: 'B' }),
      expect.objectContaining({ from: 'B', to: 'E' }),
    ])
  })

  test('convert node[] to edge[] (invalid)', () => {
    expect(() => routeFor(graph, ['A', 'F']))
      .toThrowError(/No Such Route/)
  })
})
