import { faker } from '@faker-js/faker';
function criarUsuario() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
  };
};
describe('Criação de usuário', () => {
  const usuario = criarUsuario();
  const nome = usuario.name;
  const email = usuario.email;
  const senha = usuario.password;
  let usuarioCriado;
  let accessToken;
  let id;
  describe('testes de Bad requests', () => {
     ///////////////////°N CONSEGUIR CADASTRAR°//////////////////////
    it('Deve receber bad request ao tentar cadastrar um usuário sem email', () => {
      cy.request({
        method: 'Post',
        url: '/users',
        body: {
          "name": "string",
          "password": "string",
        },
        failOnStatusCode: false
      })
    })
    it('Deve receber bad request ao tentar cadastrar um usuário sem nome', () => {
      cy.request({
        method: 'Post',
        url: '/users',
        body: {
          "email": "string",
          "password": "string",
        },
        failOnStatusCode: false
      })
    })
    it('Deve receber bad request ao tentar cadastrar um usuário sem senha', () => {
      cy.request({
        method: 'Post',
        url: '/users',
        body: {
          "name": "string",
          "email": "string",
        },
        failOnStatusCode: false
      })
    })
    it('Deve receber bad request ao tentar cadastrar um usuário já existente', () => {
      cy.request('POST', '/users', {
        name: nome,
        email: email,
        password: senha,
      });
      cy.request({
        methot: 'POST',
        url: '/users',
        body: {
          name: nome,
          email: email,
          password: senha,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(422);
        expect(response.body.error).to.equal('User already exists.');
      })
    })
  })
  ///////////////////°CONSEGUIR CADASTRAR°//////////////////////

  it.only('Deve criar um novo usuário', () => {
    cy.request('POST', '/users', usuario)
      .then((response) => {
        cy.log(response)
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('active');
        expect(response.body).to.have.property('type');
        expect(response.body.name).to.equal(nome);
        expect(response.body.email).to.equal(email);
        expect(email).to.not.equal('string');
        expect(nome).to.not.equal('string');
        expect(senha).to.not.equal('string');
        expect(senha).to.have.length.of.at.most(10)
        expect(response.body.id).to.be.an('number')
        usuarioCriado = response.body;
        id = response.body.id;
      })
  });
  
  ////////////////////////°LOGIN°///////////////////////////

  it.only('Deve verificar o login', () => {
    cy.request('POST', '/auth/login', {
      email: email,
      password: senha,
    })
      .then(function (response) {
        cy.log(response)
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('accessToken');
        accessToken = response.body.accessToken;
      })
  })
  
  ///////////////////////°°///////////////////////////
  
  it('Deve encontrar usuário criado pelo id', () => {
    cy.request({
      method: 'GET',
      url: '/users',
      body: {
        number: id,
      },
      headers: {
        Authorization: 'Bearer ' + accessToken,
      }
    })
      .then((response) => {
        cy.log(response);
        expect(response).to.equal(200);
        espect(response).to.be.an('object');
        // expect(response.body).to.deep.equal({
        //     "id": response.body.id,
        //     "name": response.name,
        //     "email": response.email,
        //     "type": 0,
        //     "active": true
        // })
      })
  })
  it.only('Promover usuário a administrador', () => {
    cy.request({
      method: 'PATCH',
      url: '/users/admin',
      headers: {
        Authorization: 'Bearer' + accessToken,
      },
    })
      .then((response) => {
        cy.log(response);
        expect(response).to.equal(204);
      })
  })
  it.only('listar usuários ', () => {
    cy.request({
      method: 'GET',
      url: '/users',
      headers: {
        Authorization: 'Bearer' + accessToken,
      },
    })
      .then((response) => {
        cy.log(response);
        expect(response).to.equal(200);
      })
  })
  
  /////////////////filmes/////////////////////

  it('Listar filmes', () => {
    cy.request('GET', '/movies?sort=true', {
      isOkStatusCode: true
    })
      .then((response) => {
        cy.log(response);
        expect(response.status).to.equal(200);
        expect(response.body).to.not.equal('string'); 
        expect(response.body).to.not.equal('number'); 

      })
  })
  it('Encontrar filme por id', () => {
    cy.request({
      method: 'GET',
      url: '/movies',
      body:{
        number: 1,
      },
      headers:{
        Authorization: 'Bearer ' + accessToken,
      }
    }). then((response)=>{
      cy.log(response);
      expect(response.status).to.equal(200);
      expect(response.body).to.not.equal('string'); 
      expect(response.body).to.not.equal('number');          
    })
  })
  it('Encontrar filme pelo Nome', () => {
    cy.request({
      method: 'GET',
      url: '/movies/search',
      body:{
        title: 'qualquer',
      },
      headers:{
        Authorization: 'Bearer ' + accessToken,
      },
      failOnStatusCode: false,
    }). then((response)=>{
      cy.log(response);
      expect(response.status).to.equal(500);      
    })  })
})
//////////////////////T_T/////////////////////////////