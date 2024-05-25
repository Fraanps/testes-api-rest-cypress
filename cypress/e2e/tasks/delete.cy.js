// metodo get porém outra rota
describe ('DELETE /tasks/:id', () => {

  beforeEach (function () {
    cy.fixture ('tasks/delete.json').then (function (tasks) {
      this.tasks = tasks;
    })
  })

  it ('remove a task', function () {

    const {user, task} = this.tasks.remove

    cy.task ('removeTask', task.name, user.email)
    cy.task ('removeUser', user.email)
    cy.postUser (user)

    cy.postSession (user)
      .then (respUser => {
        cy.postTask (task, respUser.body.token)
          .then (respTask => {
            cy.deleteTask (respTask.body._id, respUser.body.token)
              .then (response => {
                expect (response.status).to.eq (204)
              })

          })
      })

  });

  it ('remove task not found', function () {

    const {user, task} = this.tasks.delete_task_not_found

    cy.task ('removeTask', task.name, user.email)
    cy.task ('removeUser', user.email)
    cy.postUser (user)

    cy.postSession (user)
      .then (respUser => {

        cy.postTask (task, respUser.body.token)
          .then (respTask => {

            // deletando a tarefa
            cy.deleteTask (respTask.body._id, respUser.body.token)
              .then (response => {
                expect (response.status).to.eq (204)
              })

            // tentando deletar a mesma tarefa (que já foi deletada)
            cy.deleteTask (respTask.body._id, respUser.body.token)
              .then (response => {
                expect (response.status).to.eq (404)
              })

          })

      })
  })

});

