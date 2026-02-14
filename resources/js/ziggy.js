const Ziggy = {"url":"http:\/\/localhost:8000","port":8000,"defaults":{},"routes":{"welcome":{"uri":"\/","methods":["GET","HEAD"]},"auth.google":{"uri":"auth\/google","methods":["GET","HEAD"]},"auth.google.callback":{"uri":"auth\/google\/callback","methods":["GET","HEAD"]},"dashboard":{"uri":"dashboard","methods":["GET","HEAD"]},"logout":{"uri":"logout","methods":["POST"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
