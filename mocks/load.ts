import { createReadStream } from 'fs'
import csv from 'csv-parser'

import { Graph, NodeId, Node, Edge } from '@/.'

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
        if (!(edge.from in graph.nodes))
          graph.nodes[edge.from] = { id: edge.from }

        if (!(edge.to in graph.nodes))
          graph.nodes[edge.to] = { id: edge.to }

        graph.edges.push(edge)
      })
      .on('end', () => resolve(graph))
  })
}
