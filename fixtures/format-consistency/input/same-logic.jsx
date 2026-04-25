// ============================================================
// Variables & Declarations
// ============================================================
var unusedVar = 1
let mutable =    2
const CONST_VALUE = 3

// Multiple declarations on one line
let a=1,b=2,c=3
const d = 4, e = 5, f = 6

// Destructuring
const person = { firstName: 'John', lastName: 'Doe', age: 30 }
const { firstName, lastName, age: personAge } = person
const arr = [1, 2, 3]
const [first, second, ...rest] = arr
const { nested: { deep: { value } } } = { nested: { deep: { value: 42 } } }

// Spread & Rest
const merged = { ...person, city: 'NYC' }
const combined = [0, ...arr, 4, 5]
function collect(...args) { return args }

// ============================================================
// Strings & Quotes
// ============================================================
const single = 'hello'
const double = "world"
const template = `Hello, ${ single } ${ double }!`
const templateWithExpr = `Result: ${ a + b }`
const multiline = `
  Line one
  Line two
  Line three
`
const escaped = "He said \"Hello\" to me"

// ============================================================
// Numbers
// ============================================================
const decimal = 42
const exp = 1e7
const hex = 0xFF
const octal = 0o77
const binary = 0b1010
const float = 3.14

// ============================================================
// Objects & Arrays
// ============================================================
const obj = {
  "key-a": 1,
  'key-b': 2,
  keyC: 3,
  "quoted": 4,
  ['computed']: 5,
  method() { return this.keyC },
  get accessor() { return this.keyC },
  set accessor(v) { this.keyC = v },
}

const arrMixed = [1, 'two', true, null, undefined, { a: 1 }, [2, 3]]
const arrNested = [
  [1, 2],
  [3, 4],
  [5, 6],
]

// ============================================================
// Functions
// ============================================================
function funcDecl(x, y) {
  return x + y
}

const funcExpr = function (x, y) {
  return x + y
}

const arrow = x => x * 2
const arrowBlock = (x, y) => {
  return x + y
}
const arrowVoid = () => {
  console.log('void')
}

const arrowWithParams = (x) => {
  console.log(x)
}
const arrowWithParams2 = (x, y) => {
  console.log(x, y)
}
function withDefaults(x = 1, y = 'default') {
  return x + y
}

function withDestruct({ x, y = 10 }) {
  return x + y
}

function withRest(a, ...rest) {
  return rest.reduce((sum, n) => sum + n, a)
}

// IIFE
const iifeResult = (function () {
  return 42
})()

// ============================================================
// Classes
// ============================================================
class Animal {
  constructor(name) {
    this.name = name
    this._age = 0
  }

  speak() {
    return `${ this.name } makes a sound`
  }

  get age() {
    return this._age
  }

  set age(v) {
    this._age = v
  }

  static isAnimal(obj) {
    return obj instanceof Animal
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name)
    this.breed = breed
  }

  speak() {
    return `${ this.name } barks`
  }
}

// ============================================================
// Control Flow
// ============================================================
if (a > 0) {
  console.log('positive')
} else if (a < 0) {
  console.log('negative')
} else {
  console.log('zero')
}

// Ternary
const sign = a > 0 ? 'positive' : a < 0 ? 'negative' : 'zero'

// Switch
const day = 'Monday'
switch (day) {
  case 'Monday':
    console.log('Start of week')
    break
  case 'Friday':
    console.log('End of week')
    break
  default:
    console.log('Midweek')
}


//short if
if (a > 0) console.log('positive')

// Loops
for (let i = 0; i < 5; i++) {
  if (i === 2) continue
  if (i === 4) break
  console.log(i)
}

for (const item of arr) {
  console.log(item)
}

for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key, obj[key])
  }
}

let count = 0
while (count < 3) {
  count++
}

do {
  count--
} while (count > 0)

// ============================================================
// Error Handling
// ============================================================
try {
  JSON.parse('invalid')
} catch (err) {
  console.error('Parse error:', err.message)
} finally {
  console.log('Done')
}

// ============================================================
// Operators
// ============================================================
const bitwise = 5 & 3 | 8
const logical = a && b || c
const nullish = a ?? b
const optional = obj?.nested?.deep
const coalesce = a == null ? b : a

// ============================================================
// Import / Export (simulated as comments, actual imports at top)
// ============================================================
// import { foo, bar as baz } from 'module'
// import * as utils from 'utils'
// import defaultExport from 'default'
// export { funcDecl, arrow }
// export default obj
// export * from './other'

// ============================================================
// Comments & JSDoc
// ============================================================
// TODO: optimize this
// FIXME: handle edge case
// HACK: workaround for legacy
/*
 * Multi-line comment
 * describing the function below
 */
/** @type {number} */
const typed = 10

// ============================================================
// Async
// ============================================================
async function fetchData(url) {
  const res = await fetch(url)
  return res.json()
}

const promiseChain = fetch('url')
  .then(r => r.json())
  .then(data => data.items)
  .catch(err => console.error(err))
  .finally(() => console.log('complete'))

// ============================================================
// Generators
// ============================================================
function* gen() {
  yield 1
  yield 2
  yield 3
}

// ============================================================
// Regex
// ============================================================
const regex = /\d+/gi
const regexCtor = new RegExp('\\d+', 'g')

// ============================================================
// Global usage
// ============================================================
console.log(
  single,
  double,
  template,
  obj,
  arr,
  funcDecl(1, 2),
  arrow(5),
  merged,
  combined,
  collect(1, 2, 3),
  new Dog('Rex', 'German Shepherd').speak(),
  regex.test('123'),
  iifeResult,
  sign,
)
