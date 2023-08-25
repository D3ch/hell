self.__uv$config = {
    prefix: '/static/tiw/',
    bare: 'https://d8e3f3bb-17d0-4f36-87f5-ba27d422fa8c.id.repl.co/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/static/uv/uv.handler.js',
    bundle: '/static/uv/uv.bundle.js',
    config: '/static/uv/uv.config.js',
    sw: '/static/uv/uv.sw.js',
};
