

describe('POST /users', () => {

  beforeEach(function(){
    cy.fixture('users').then(function (users) {
        this.users = users
    })
  })


  it('register a new user', function(){

    const user = this.users.create

    // deletando o usuário antes do teste de cadastro
    cy.task('removeUser', user.email)

    cy.postUser(user)
      .then(response => {
        // verificação
        expect(response.status).to.eq(200)
        cy.log(JSON.stringify(response.body)) // pegando o resultado ra requisição
      })
  })

  it('duplicate email', function() {
    const user = this.users.duplicate_email

    // deletando o usuário antes do teste de cadastro
    cy.task('removeUser', user.email)
    cy.postUser(user) // cdastrando o mesmo usuário para ter o email duplicado

    cy.postUser(user)
      .then(response => {

        const { message } = response.body
        // verificação
        expect(response.status).to.eq(409)
        expect(message).to.eq('Duplicated email!')

      })
  })

  context('required fields', () => {
    let user;
    beforeEach(function() {
      user = this.users.required_fields
    })

    it('name is required', () => {

      // deletando o nome do usuario
      delete user.name

      cy.postUser(user)
        .then(response => {

          const { message } = response.body


          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"name\" is required')
        })

    })

    it('email is required', () => {

      // deletando o nome do usuario
      delete user.email

      cy.postUser(user)
        .then(response => {

          const { message } = response.body


          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"email\" is required')
        })

    })

    it('password is required', () => {

      // deletando o nome do usuario
      delete user.password

      cy.postUser(user)
        .then(response => {
          const { message } = response.body
          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"password\" is required')
        })

    })

  })

})


