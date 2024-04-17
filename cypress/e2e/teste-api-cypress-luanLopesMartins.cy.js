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
    describe('testes de Bad requests',()=>{
        it('Deve receber bad request ao tentar cadastrar um usuário sem email',()=>{
            cy.request({
                method: 'Post',
                url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
                body: {
                    "name": "string",
                    "password": "string",
                  },
                failOnStatusCode: false
            })
        })
        it('Deve receber bad request ao tentar cadastrar um usuário sem nome',()=>{
            cy.request({
                method: 'Post',
                url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
                body: {
                    "email": "string",
                    "password": "string",
                  },
                failOnStatusCode: false
            })
        })
        it('Deve receber bad request ao tentar cadastrar um usuário sem senha',()=>{
            cy.request({
                method: 'Post',
                url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
                body: {
                    "name": "string",
                    "email": "string",
                  },
                failOnStatusCode: false
            })
        })
    })
    it('Deve criar um novo usuário', () => {
        cy.request('POST', 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', usuario)
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
    it('Deve verificar o login', () => {
        cy.request('POST', 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login', {
            email: usuario.email,
            password: usuario.password,
        })
            .then(function (response) {
                cy.log(response)
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('accessToken');
                accessToken = response.body.accessToken;
            })
    })
    it('Deve encontrar usuário criado pelo id', () => {
        cy.request({
            method:'GET',
            url:'https://raromdb-3c39614e42d4.herokuapp.com/api/users',
            body:{},
            headers:{
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
    it('Promover usuário a administrador', () => {
        cy.request('PATCH', 'https://raromdb-3c39614e42d4.herokuapp.com/api/users/admin')
            .then((response) => {
                cy.log(response);
                expect(response).to.equal(204);
            })
    })
    //filmes//
    it('Listar filmes', () => {
        cy.request('GET', 'https://raromdb-3c39614e42d4.herokuapp.com/api/movies?sort=true', {
            isOkStatusCode: true
        })
            .then((response) => {
                cy.log(response);
                expect(response).to.equal(200);
                //expect(response.body.id).to.be.an('object')
            })
    })
    it('Encontrar filme por id', () => {
        // cy.request('GET','')
    })
    it('Encontrar filme pelo Nome', () => {
        // cy.request('GET','')
    })
})
