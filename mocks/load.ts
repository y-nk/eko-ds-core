import { createReadStream } from 'fs'
import csv from 'csv-parser'

import { Graph, NodeId, Node, Edge, add, link } from '@/.'

export const load = async (file: string): Promise<Graph> => {
  const graph: Graph = {
    nodes: {},
    edges: []
  }

  return new Promise(resolve => {
    createReadStream(file)
      .pipe(csv({
        separator: ';',
        mapValues: ({ header, value }) => (
          header !== 'cost' ? value : parseInt(value)
        )
      }))
      .on('data', (edge: Edge) => {
        add(graph, edge.from)
        add(graph, edge.to)
        link(graph, edge.from, edge.to, edge.cost)
      })
      .on('end', () => resolve(graph))
  })
}
