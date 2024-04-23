import { faker } from '@faker-js/faker';
function criarUsuario() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
    password5: faker.internet.password({length:5}),
    password13: faker.internet.password({length:13},)
  };
};
describe('Criação de usuário', () => {
  const usuario = criarUsuario();
  const nome = usuario.name;
  const email = usuario.email;
  const senha = usuario.password;
  const senha5 = usuario.password5;
  const senha13 = usuario.password13;
  let usuarioCriado;
  let accessToken;
  let token;
  let id;
  let adm;
  let idMovie;
  let titleM;

  describe('testes de Bad requests', () => {
    ///////////////////°NÃO CONSEGUIR CADASTRAR°//////////////////////
    it('Deve receber bad request ao tentar cadastrar um usuário sem email', () => {
      cy.request({
        method: 'Post',
        url: '/users',
        body: {
          "name": nome,
          "password": senha,
        },
        failOnStatusCode: false
      })
    })
    // alterações
    it('Deve receber bad request ao tentar cadastrar um usuário sem nome', () => {
      cy.request({
        method: 'Post',
        url: '/users',
        body: {
          "email": email,
          "password": senha,
        },
        failOnStatusCode: false
      })
    })
    it('Deve receber bad request ao tentar cadastrar um usuário sem senha', () => {
      cy.request({
        method: 'Post',
        url: '/users',
        body: {
          "name": nome,
          "email": email,
        },
        failOnStatusCode: false
      })
    })
    it('Deve receber bad request ao tentar cadastrar um usuário com senha menor que 6 digitos', () => {
      cy.request({
        method: 'Post',
        url: '/users',
        body: {
          "name": nome,
          "email": email,
          "password": senha5,
        },
        failOnStatusCode: false
      })
    })
    it('Deve receber bad request ao tentar cadastrar um usuário com senha maior que 12 digitos', () => {
      cy.request({
        method: 'Post',
        url: '/users',
        body: {
          "name": nome,
          "email": email,
          "password": senha13,
        },
        failOnStatusCode: false
      })
    })
    it('Deve receber bad request ao tentar cadastrar um usuário já existente', () => {
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
        expect(response.status).to.equal(401);
        expect(response.body.error).to.equal('Unauthorized');
      })
    })
  })
  ///////////////////°CONSEGUIR CADASTRAR°//////////////////////
  describe('CONSEGUIR CADASTRAR', () => {
    it('Deve criar um novo usuário', () => {
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
  })
  ////////////////////////°LOGIN°///////////////////////////
  describe('Autenticação de login', () => {
    it('Deve verificar o login', () => {
      cy.request('POST', '/auth/login', {
        email: email,
        password: senha,
      })
        .then(function (response) {
          cy.log(response)
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('accessToken');
          accessToken = response.body.accessToken;
          cy.log(accessToken);
          token = accessToken;
        })
    })
  })
  ///////////////////////°USUÁRIO CRÍTICO, REVIEW DE UM FILME°///////////////////////////
  describe('Tornar usuário Crítico, fazer review de filme', () => {
    it('Criar Review de um filme', () => {
      cy.request({
        method: 'POST',
        url: '/users/review',
        body: {
          "movieId": 85,
          "score": 5,
          "reviewText": "realmente bacana"
        },
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => {
          cy.log(response);
          expect(response.status).to.equal(201);
          cy.log(response.body)
        })
    })
    it('fazer outra Review deste mesmo filme', () => {
      cy.request({
        method: 'POST',
        url: '/users/review',
        body: {
          "movieId": 85,
          "score": 4.5,
          "reviewText": "realmente bacana, mas agora enjoei de tanto ver"
        },
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => {
          cy.log(response);
          expect(response.status).to.equal(201);
          cy.log(response.body)
        })
    })
    it('Listar todas as Reviews de filmes criadas pelo usuário', () => {
      cy.request({
        method: 'GET',
        url: '/users/review/all',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => {
          cy.log(response);
          expect(response.status).to.equal(200);
          cy.log(response.array);
        })
    })
    it('Promover usuário a critico', () => {
      cy.request({
        method: 'PATCH',
        url: '/users/apply',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => {
          cy.log(response);
          expect(response.status).to.equal(204);
        })
    })
  })
  ///////////////////////°LISTAR, CONSULTAR USUARIO E ADMIN°///////////////////////////
  describe('Listar, Consultar e tornar administrador', () => {
    it('Deve encontrar usuário criado pelo id', () => {
      cy.request({
        method: 'GET',
        url: '/users/' + id,
        body: {
          number: id,
        },
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
        .then((response) => {
          cy.log(response);
          cy.log(id),
            expect(response.status).to.equal(200);
          //espect(response).to.be.an('object');
          expect(response.body).to.deep.equal({
            "id": response.body.id,
            "name": nome,
            "email": email,
            "type": 2,
            "active": true
          })
          adm = response.body.type;
          cy.log(adm);
        })
    })

    it('Promover usuário a administrador', () => {
      cy.log(token),
        cy.request({
          method: 'PATCH',
          url: '/users/admin',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
          .then((response) => {
            cy.log(response);
            expect(response.status).to.equal(204);
          })
    })
    it('listar usuários ', () => {
      // não dá certo, código 401;
      cy.request({
        method: 'GET',
        url: '/users',
        headers: {
          Authorization: 'Bearer' + token,
        },
        failOnStatusCode: false
      })
        .then((response) => {
          cy.log(response);
          expect(response.status).to.equal(401);
        })
      //Dá certo, código 200
      cy.request({
        method: 'GET',
        url: '/users',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => {
          cy.log(response);
          cy.log(response.array);
          expect(response.status).to.equal(200);
        })
    })
  })

  /////////////////filmes/////////////////////
  describe('Listar e encontrar FILMES por id e nome', () => {

    it('Criar um filme ', () => {
      cy.request({
        method: 'POST',
        url: '/movies',
        body: {
          title: "jengaII,extended",
          genre: "ação",
          description: "bacana bacanuda",
          durationInMinutes: 100,
          releaseYear: 2000,
        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }).then((response) => {
        cy.log(response);
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('title');
        idMovie = response.body.id;
        titleM = response.body.title
        cy.log(idMovie);
        cy.log(titleM);

      })
    })
    it('Atualizar um filme ', () => {
      cy.request({
        method: 'PUT',
        url: '/movies/' + idMovie,
        body: {
          title: "jengaIII",
          genre: "ação",
          description: "bacana bacanuda, muita bacanação",
          durationInMinutes: 120,
          releaseYear: 2003,
        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }).then((response) => {
        cy.log(response);
        expect(response.status).to.equal(204);
      })
    })
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
    it('Criar Review do filme criado', () => {
      cy.request({
        method: 'POST',
        url: '/users/review',
        body: {
          "movieId": idMovie,
          "score": 5,
          "reviewText": "esse filme é bacana, melhor de todos."
        },
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => {
          cy.log(response);
          expect(response.status).to.equal(201);
          cy.log(response.body)
        })
    })
    it('fazer outra Review deste mesmo filme criado', () => {
      cy.request({
        method: 'POST',
        url: '/users/review',
        body: {
          "movieId": idMovie,
          "score": 4.5,
          "reviewText": "realmente bacana, mas agora enjoei de tanto ver"
        },
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then((response) => {
          cy.log(response);
          expect(response.status).to.equal(201);
          cy.log(response.body)
        })
    })
    it('Encontrar filme por id', () => {
      cy.request({
        method: 'GET',
        url: '/movies/' + idMovie,
        body: {
          number: idMovie,
        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
        }
      }).then((response) => {
        cy.log(response);
        expect(response.status).to.equal(200);
        expect(response.body).to.not.equal('string');
        expect(response.body).to.not.equal('number');
        //expect(response.array).to.deep.equal('object');
        expect(response.body).to.have.deep.property('reviews');
        expect(response.body).to.have.property('criticScore');
        //expect(response.body.reviews).to.equal('array');
        //expect(response.body.reviews).to.have.deep.property('score');
      })
      // FILME INEXISTENTE//
      cy.request({
        method: 'GET',
        url: '/movies/' + 12345,
        body: {
          number: idMovie,
        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
        }
      }).then((response) => {
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
        body: {
          title: 'qualquer',
        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        failOnStatusCode: false,
      }).then((response) => {
        cy.log(response);
        expect(response.status).to.equal(500);
      })
      cy.request({
        method: 'GET',
        url: '/movies/search?title=' + titleM,
        // body: {
        //   title: titleM,
        // },
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }).then((response) => {
        cy.log(response);
        expect(response.status).to.equal(200);
      })
    })
    it('Deletar um filme ', () => {
      cy.request({
        method: 'DELETE',
        url: '/movies/' + idMovie,
        body: {

        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }).then((response) => {
        cy.log(response);
        expect(response.status).to.equal(204);
      })
    })
  })
})
//////////////////////T_T/////////////////////////////