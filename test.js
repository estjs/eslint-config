const reg = /^((m|p|border|b)-?)?([blrtxy])(?:-?(-?.+))?$/;
const cls = 'mx-base my-base mr-base ml-base h-100vh flex-shrink-0';

cls.split(' ').forEach((cl)=>{
  console.log(reg.test(cl));
  console.log(cl.match(reg));
});
