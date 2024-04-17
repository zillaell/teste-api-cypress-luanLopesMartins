const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    //login de administrador//
    email: 'jotaro@qa.com',
    password: 'senhasenha',
    enviromentName: process.env.ENVIRONMENT_NAME,
  },
  
  e2e: {
    baseUrl: 'https://raromdb-3c39614e42d4.herokuapp.com/api',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
