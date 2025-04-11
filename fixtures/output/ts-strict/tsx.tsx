export function Component1() {
  return <div />;
}

export function jsx2() {
  const props = { a: 1, b: 2 };
  return (
    <a foo="bar" bar={`foo`}>
      <div {...props} a={1} b="2">
        Inline Text
      </div>
      <Component1>Block Text</Component1>
      <div className="  text-bold text-12 blur-sm text-red-500 text-center  w-10px h-10px  ">
        Mixed
        <div>Foo</div>
        Text<b> Bar</b>
      </div>
      <p>
        foo<i>bar</i>
        <b>baz</b>
      </p>
    </a>
  );
}
