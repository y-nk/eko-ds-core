import { load } from '~/mocks/load'
import { Graph, routeFor, costOf, routesFor } from '@/index'

export default () => describe('Business rules', () => {
  let graph: Graph

  beforeAll(async () => {
    graph = await load('./mocks/db.csv')
  })

  test('delivery cost #1', () => {
    const route = routeFor(graph, ['A', 'B', 'E'])
    expect(costOf(route)).toEqual(4)
  })

  test('delivery cost #2', () => {
    const route = routeFor(graph, ['A', 'D'])
    expect(costOf(route)).toEqual(10)
  })

  test('delivery cost #3', () => {
    const route = routeFor(graph, ['E', 'A', 'C', 'F'])
    expect(costOf(route)).toEqual(8)
  })

  test('delivery cost #4', () => {
    expect(() => routeFor(graph, ['A', 'F']))
      .toThrowError(/No Such Route/)
  })

  test('number of routes #1', () => {
    const routes = routesFor(graph, 'E', 'D', route => route.length <= 4)
    expect(routes.length).toBe(4)
  })

  test('number of routes #2', () => {
    const routes = routesFor(graph, 'E', 'E')
    expect(routes.length).toBe(5)
  })

  test('number of routes #3 (bonus)', () => {
    const routes = routesFor(graph, 'E', 'E', route => costOf(route) < 20, 2)
    expect(routes.length).toBe(29)
  })

  test('cheapest cost #1', () => {
    const cheapest = routesFor(graph, 'E', 'D')
      .sort((a, b) => costOf(b) - costOf(a))
      .pop()!

      expect(costOf(cheapest)).toBe(9)
  })

  test('cheapest cost #2', () => {
    const cheapest = routesFor(graph, 'E', 'E')
      .sort((a, b) => costOf(b) - costOf(a))
      .pop()!

    expect(costOf(cheapest)).toBe(6)
  })
})
