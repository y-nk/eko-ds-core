import { load } from '~/mocks/load'
import { use, routeFor, costOf, routesFor } from '@/index'

export default () => describe('Business rules', () => {
  beforeAll(async () => {
    const graph = await load('./mocks/db.csv')
    use(graph)
  })

  test('delivery cost #1', () => {
    const route = routeFor(['A', 'B', 'E'])
    expect(costOf(route)).toEqual(4)
  })

  test('delivery cost #2', () => {
    const route = routeFor(['A', 'D'])
    expect(costOf(route)).toEqual(10)
  })

  test('delivery cost #3', () => {
    const route = routeFor(['E', 'A', 'C', 'F'])
    expect(costOf(route)).toEqual(8)
  })

  test('delivery cost #4', () => {
    expect(() => routeFor(['A', 'F']))
      .toThrowError(/No Such Route/)
  })

  test('number of routes #1', () => {
    const routes = routesFor('E', 'D', route => route.length <= 4)
    expect(routes.length).toBe(4)
  })
})
