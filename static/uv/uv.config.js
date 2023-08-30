self.__uv$config = {
    prefix: '/static/tiw/',
    bare: 'https://a7ed34d5-5adf-4150-b6c0-66fc5b7cb8c0.id.repl.co/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/static/uv/uv.handler.js',
    bundle: '/static/uv/uv.bundle.js',
    config: '/static/uv/uv.config.js',
    sw: '/static/uv/uv.sw.js',
};
