const get_recaptcha_token = () => {
  return new Promise((resolve, reject) => {
    grecaptcha.ready(function() {
      grecaptcha.execute('6LdvBaEjAAAAAIKTgdecsZBehRxhVZOIDzG9MvXg', { action: 'validate_recaptcha' })
          .then(function(token) {
              resolve(token);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
  })
}