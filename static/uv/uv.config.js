self.__uv$config = {
    prefix: '/static/tiw/',
    bare: 'https://165e5daf-3e90-4487-97ce-9fd0869196f3.id.repl.co/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/static/uv/uv.handler.js',
    bundle: '/static/uv/uv.bundle.js',
    config: '/static/uv/uv.config.js',
    sw: '/static/uv/uv.sw.js',
};
