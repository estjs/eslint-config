async function foo(msg) {
  console.log(msg);
}

function bar(x) {
  return x * x;
}

const [a, b] = await Promise.all([Promise.resolve(1), Promise.resolve(2)]);
