import { load } from '~/mocks/load'
import { use, edgesOf } from '@/index'

export default () => describe('utilities', () => {
  test('load data', async () => {
    const graph = await load('./mocks/db.csv')

    expect(graph.nodes.length).not.toBe(0)
    expect(graph.edges.length).not.toBe(0)

    use(graph)
  })

  test('find edges of a starting point (valid)', () => {
    expect(edgesOf('A', 'from')).toEqual([
      expect.objectContaining({ from: 'A', to: 'B' }),
      expect.objectContaining({ from: 'A', to: 'C' }),
      expect.objectContaining({ from: 'A', to: 'D' }),
    ])
  })

  test('find edges of a starting point (invalid)', () => {
    expect(() => edgesOf('Z'))
      .toThrowError(/No Such Node/)
  })
})
