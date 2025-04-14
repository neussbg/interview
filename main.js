function test(a, b) {
  return a + b;
}

const res = test.bind(null, 2);

console.log(res(10));
