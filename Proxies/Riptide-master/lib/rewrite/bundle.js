class Rewrite {
  constructor(ctx) {
    return {
      HTML: require('./html')(ctx),
      CSS: require('./css')(ctx),
      JS: require('./js')(ctx)
    }
  }
}

module.exports = Rewrite