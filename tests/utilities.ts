import { load } from '~/mocks/load'

export default () => describe('utilities', () => {
  test('load data', async () => {
    const graph = await load('./mocks/db.csv')

    expect(graph.nodes.length).not.toBe(0)
    expect(graph.edges.length).not.toBe(0)
  })
})
