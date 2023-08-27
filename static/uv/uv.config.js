self.__uv$config = {
    prefix: '/static/tiw/',
    bare: 'https://acfbab35-b9ba-4463-9677-89f31396725f.id.repl.co/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/static/uv/uv.handler.js',
    bundle: '/static/uv/uv.bundle.js',
    config: '/static/uv/uv.config.js',
    sw: '/static/uv/uv.sw.js',
};
