function Base64(ctx) {
  return {
    encode(str) {
      return new Buffer.from(str, 'utf-8').toString('base64')
    },
    decode(str) {
      return new Buffer.from(str, 'base64').toString('utf-8')
    }
  }
}

module.exports = Base64