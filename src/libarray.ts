// compare {a} to {b}
export const equal = <T>(a: T[], b: T[]): boolean => (
  a === b || (
    a.length === b.length && !a.some((e, i) => e !== b[i])
  )
)

// indexesOf {source} in {haystack}
export const indexesOf = <T>(needle: T[], haystack: T[]): number[] => (
  haystack
    // find possible indexes to scan
    .reduce<number[]>((array, entry, index) => (
      entry === needle[0] ? array.concat(index) : array
    ), [])
    // keep only the ones which satisfies the needle 100%
    .filter(offset => (
      needle.every((entry, index) => entry === haystack[offset + index])
    ))
)

// replace {pattern} by {item} in {source}
export const replaceBy = <T>(pattern: T[], item: T, source: T[]) => {
  const clone = [...source]

  indexesOf(pattern, source)
    .reverse()
    .forEach(index => clone.splice(index, pattern.length, item))

  return clone
}

type Report<T> = {
  pattern: T[],
  count: number,
}

// patterns of {source} of size {size}
export const patternsOf = <T>(source: T[], min: number = 2, max: number = NaN): Report<T>[] => {
  const reports: Report<T>[] = []

  if (isNaN(max))
    max = (source.length * .5) | 0

  for (let size = min; size <= max; size++)
    for (let i = 0; i < source.length - size; i++) {
      const pattern = source.slice(i, i + size)

      // if we don't have already a repport on that pattern, mark it
      if (!reports.find(report => equal(report.pattern, pattern))) {
        const count = indexesOf(pattern, source).length

        if (count > 1)
          reports.push({ pattern, count })
      }
    }

  return reports
}
