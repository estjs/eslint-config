/// to-function
const foo = async (msg) => {
  console.log(msg)
}

/// to-function
const bar = (x) => x * x

/// to-promise-all
const a = await Promise.resolve(1)
const b = await Promise.resolve(2)
