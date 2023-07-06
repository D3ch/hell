self.__uv$config = {
    prefix: '/static/tiw/',
    bare: 'https://99e74781-413a-4718-8a5a-ed4f0556b3cb.id.repl.co/bare/',
    /*https://baresw.starttiw.org */
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/static/uv/uv.handler.js',
    bundle: '/static/uv/uv.bundle.js',
    config: '/static/uv/uv.config.js',
    sw: '/static/uv/uv.sw.js',
};
