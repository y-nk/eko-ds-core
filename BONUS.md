# A note about the "bonus" case

I've been trying to wrap my head around it for hours, if not days.

The case of "all combinations of E,E where one route can be used _at most 2 times_" **ends up to 27 according to me, not 29** (or 21, which is an equally possible interpretation of the rule).

**The possible endings with 29 are :**
- You can make at most 2 _stops_ by your destination
- You can use a route at most _3_ times

### Here are my thoughts about it:

The first combinations are the "pure" routes _(those which don't pass again through E)_ :

```js
let V1 = 'EB-BE'
let V2 = 'EA-AB-BE'
let V3 = 'EA-AD-DE'
let V4 = 'EA-AC-CD-DE'
let V5 = 'EA-AC-CF-FD-DE'

let n = 5 // the number of pure routes
```

The sum of all combinations is `n^n + n^(n-1) + ... + n^1` which (quickly) represents:

```js
Vn + // (n^1)
Vn, Vn + // (n^2)
Vn, Vn, Vn + // (n^3)
Vn, Vn, Vn, Vn + // (n^4)
Vn, Vn, Vn, Vn, Vn + // (n^5)
```

That's _a lot_ of combinations (3905). The last one with 2 times the same route is `V5V5V4V4V3`... but if we compute the costs, we can put down some of them:

```js
let costs = {
  V1: 6,
  V2: 6,
  V3: 13,
  V4: 11,
  V5: 10,
}
```

1. We can easily remove combinations with 4 or 5 items, since the combinations will be _"at least the cheapest times 4"_, which is `V1 * 4 = 24`.
    So basically we can turn down the combinations to: `n^3 + n^2 + n^1` (155).

2. **for Vn** : all should be ok ; the most expensive is below 20. The number of solution is `(V1, V2, V3, V4, V5) ^ (Vn) → 5 ^ 1 → 5`, so 5.

3.  **for Vn, Vn** : The normal set should be `(V1, V2, V3, V4, V5) ^ (Vn, Vn) → 5 ^ 2 → 25` but the combinations containing _exclusively_ V3, V4, V5 won't pass since the combination of the cheapest (V5,V5) is already over the limit, so we must remove `(V3, V4, V5) ^ (Vn, Vn) → 3 ^ 2 → 9`, which makes 16.

4. **for Vn, Vn, Vn** : The normal set should be `(V1, V2, V3, V4, V5) ^ (Vn, Vn, Vn) → 5 ^ 3 → 125`. That said, all the combinations using other vectors than V1 or V2 won't pass because the cheapest combination including either v3, v4 or V5 (ie: V1, V1, V5) is more than 20. So the set is actually `(V1, V2) ^ (Vn, Vn, Vn) → 2 ^ 3 → 8`, total of 8.

Summarized, the system representing all combinations now is:

1. Vn → **5**
2. Vn, Vn → `25 - 9` → **16**
3. Vn, Vn, Vn → `2³` → **8**

total now is 29... **but**.

We must also exclude the routes for `(Va, Vb, Vc)` where `Va === Vb === Vc`. The only combinations left are `(V1, V1, V1)` and  `(V2, V2, V2)`, which leads to **27**.

<br>

Also, if you consider that an edge is a route, then when "an edge cannot be repeated _more than two times_" the number of solutions falls down to **21**, since both V1 and V2 shares `BE` at the end, all routes for `(Vn, Vn, Vn)` would end with `(BE, BE, BE)`.

So, we can only reach 29 if :

- You can use a route at most _3_ times
- You can make at most 2 _stops_ by your destination

But not if :

- You can use a route at most _2_ times

---

## Bruce force

At some point I got paranoid about my maths so I coded this.

- checking on vectors (27): https://jsfiddle.net/y_nk/f2ra7yju/
- checking on edges (21): https://jsfiddle.net/y_nk/4kd17xes/

---

## Table for computation

At some point I got paranoid about my maths so I drew this.

- `○` : OK
- `✕` : Too expensive
- `△` : 3 times

### VnVn

|    | V1 | V2 | V3 | V4 | V5 |
|:--:|:--:|:--:|:--:|:--:|:--:|
| V1 |  ○ |  ○ |  ○ |  ○ |  ○ |
| V2 |  ○ |  ○ |  ○ |  ○ |  ○ |
| V3 |  ○ |  ○ |  ✕ |  ✕ |  ✕ |
| V4 |  ○ |  ○ |  ✕ |  ✕ |  ✕ |
| V5 |  ○ |  ○ |  ✕ |  ✕ |  ✕ |

### V1VnVn

| V1 | V1 | V2 | V3 | V4 | V5 |
|:--:|:----:|:----:|:--:|:--:|:--:|
| V1 |  △    |   ○  |  ✕ |  ✕ |  ✕ |
| V2 |   ○  |   ○  |  ✕ |  ✕ |  ✕ |
| V3 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V4 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V5 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |

### V2VnVn

| V2 | V1 | V2 | V3 | V4 | V5 |
|:--:|:----:|:----:|:--:|:--:|:--:|
| V1 |   ○  |   ○  |  ✕ |  ✕ |  ✕ |
| V2 |   ○  |   △  |  ✕ |  ✕ |  ✕ |
| V3 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V4 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V5 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |

### V3VnVn

| V3 | V1 | V2 | V3 | V4 | V5 |
|:--:|:----:|:----:|:--:|:--:|:--:|
| V1 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V2 |   ✕  |   ✕ |  ✕ |  ✕ |  ✕ |
| V3 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V4 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V5 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |

### V4VnVn

| V4 | V1 | V2 | V3 | V4 | V5 |
|:--:|:----:|:----:|:--:|:--:|:--:|
| V1 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V2 |   ✕  |   ✕ |  ✕ |  ✕ |  ✕ |
| V3 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V4 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V5 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |

### V5VnVn

| V5 | V1 | V2 | V3 | V4 | V5 |
|:--:|:----:|:----:|:--:|:--:|:--:|
| V1 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V2 |   ✕  |   ✕ |  ✕ |  ✕ |  ✕ |
| V3 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V4 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
| V5 |   ✕  |   ✕  |  ✕ |  ✕ |  ✕ |
