import { equal, indexesOf, replaceBy, patternsOf } from '~/src/libarray'

export default () => describe('* libarray', () => {
  test('lazy array equality', () => {
    const a = ['AB', 'BE']
    const b = a.concat()

    // strict equal
    expect(equal(a, a)).toBe(true)

    // "lazy deep" equal
    expect(equal(a, b)).toBe(true)

    // unequal
    expect(equal(a, [])).toBe(false)
    expect(equal([], b)).toBe(false)
  })

  test('find subarray in array', () => {
    const needle1 = 'AB BE EB'.split(' ')
    const needle2 = 'BE EB BE'.split(' ')
    const needle3 = 'EB BE EB'.split(' ')
    const needle4 = 'BE EA AB'.split(' ')
    const needle5 = 'BE EA AC'.split(' ')

    const haystack = 'AB BE EB BE EB BE EA AB BE EB BE'.split(' ')
    //                ^  ^  ^  ^     ^     ^  ^
    // needle number: 1  2  3  2     4     1  2
    // array index:   0  1  2  3  4  5  6  7  8  9  10

    expect(indexesOf(needle1, haystack)).toEqual([0, 7])
    expect(indexesOf(needle2, haystack)).toEqual([1, 3, 8])
    expect(indexesOf(needle3, haystack)).toEqual([2])
    expect(indexesOf(needle4, haystack)).toEqual([5])
    expect(indexesOf(needle5, haystack)).toEqual([])
  })

  test('replace subarray in array by item', () => {
    const needle = 'BE EB BE'.split(' ')

    const haystack = 'AB BE EB BE EB BE EA AB BE EB BE'.split(' ')
    //                   ^     ^              ^
    // needle number:    X     X              X
    // array index:   0  1  2  3  4  5  6  7  8  9  10

    const item = 'BE'

    expect(replaceBy(needle, item, haystack)).toEqual(
      'AB BE EA AB BE'.split(' ')
    )
  })

  test('find patterns in array of size', () => {
    const haystack = 'AB BE EB BE EB BE EA AB BE EB BE EB'.split(' ')

    expect(patternsOf(haystack, 2, 2)).toEqual([
      { pattern: 'AB BE'.split(' '), count: 2 },
      { pattern: 'BE EB'.split(' '), count: 4 },
      { pattern: 'EB BE'.split(' '), count: 3 },
    ])
  })

  test('find all patterns in array', () => {
    const haystack = 'AB BE EB BE EB BE EA AB BE EB BE EB'.split(' ')

    expect(patternsOf(haystack)).toEqual([
      { pattern: 'AB BE'.split(' '),          count: 2 },
      { pattern: 'BE EB'.split(' '),          count: 4 },
      { pattern: 'EB BE'.split(' '),          count: 3 },
      { pattern: 'AB BE EB'.split(' '),       count: 2 },
      { pattern: 'BE EB BE'.split(' '),       count: 3 },
      { pattern: 'EB BE EB'.split(' '),       count: 2 },
      { pattern: 'AB BE EB BE'.split(' '),    count: 2 },
      { pattern: 'BE EB BE EB'.split(' '),    count: 2 },
      { pattern: 'AB BE EB BE EB'.split(' '), count: 2 },
    ])
  })
})
