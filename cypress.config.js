const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    //login de administrador//
    email: 'jotaro@qa.com',
    password: 'senhasenha',
    enviromentName: process.env.ENVIRONMENT_NAME,
    idJotaro: 2979,
    Token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTc0LCJlbWFpbCI6ImpvdGFyb0BxYS5jb20iLCJpYXQiOjE3MTMzODc2ODcsImV4cCI6MTcxMzM5MTI4N30.1hp9MzuijMOMU13xVI-IDKR5kWfnM8WX9VnVxMXPysQ',
    Type: 1, //administrador
  },
  
  e2e: {
    baseUrl: 'https://raromdb-3c39614e42d4.herokuapp.com/api',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
