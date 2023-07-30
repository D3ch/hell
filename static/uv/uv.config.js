self.__uv$config = {
    prefix: '/static/tiw/',
    bare: 'https://a0225709-5c1a-499f-ae29-3c45d158dac3.id.repl.co/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/static/uv/uv.handler.js',
    bundle: '/static/uv/uv.bundle.js',
    config: '/static/uv/uv.config.js',
    sw: '/static/uv/uv.sw.js',
};
