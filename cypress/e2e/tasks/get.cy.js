describe('GET /tasks', ()=> {
  beforeEach(function (){
    cy.fixture('tasks/get.json').then(function(tasks){
      this.tasks = tasks;
    })
  })

  it('get my tasks', function() {
    const {user, tasks} = this.tasks.list

    cy.task('deleteTasksLike', 'Estud4r')
    cy.task('deleteUser', user.email)
    cy.postUser(user)

    cy.postSession(user)
      .then(respUser => {
        // salvando as 3 tarefas
        tasks.forEach(function(t){
          cy.postTask(t, respUser.body.token)
        })

        cy.api({
          url: '/tasks',
          method: 'GET',
          headers:{
            Authorization: respUser.body.token
          },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.eq(200)
        }).its('body')
          .should('be.an', 'array')// verificando se a reposta é um array
          .and('have.length', tasks.length) // verificando a quantidade de itens de retorno
      })

    //cy.task('deleteTasksLike', 'Estud4r')


  })
})