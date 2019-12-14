import { createReadStream } from 'fs'
import csv from 'csv-parser'

import { Graph, Node, Edge } from '@/.'

export const load = async (file: string): Promise<Graph> => {
  const graph: Graph = {
    nodes: [],
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
        if (!graph.nodes.includes(edge.from))
          graph.nodes.push(edge.from)

        if (!graph.nodes.includes(edge.to))
          graph.nodes.push(edge.to)

        graph.edges.push(edge)
      })
      .on('end', () => resolve(graph))
  })
}
