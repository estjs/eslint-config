export function HelloWorld({
  greeting = "hello", greeted = '"World"', silent = false, onMouseOver,}) {

  if(!greeting){
    return null};

      // TODO: Don't use random in render
  let num = Math
  .floor (Math.random() * 1E+7).toString()
    .replace(/\.\d+/ig, "")

  return <div className='HelloWorld p-1 m-2 items-center flex grid-cols-2 grid' title={`You are visitor number ${ num }`} onMouseOver={onMouseOver}>
    <strong>{ greeting.slice( 0, 1 ).toUpperCase() + greeting.slice(1).toLowerCase() }</strong>
    {greeting.endsWith(",")
    ? " " : <span style={{color: '\grey'}}>", "</span> }
    <em>
  { greeted }
  </em>
    { (silent)? ".": "!"}
    </div>;

}