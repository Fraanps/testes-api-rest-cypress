
describe('POST /tasks', () => {

    beforeEach(function () {
        cy.fixture('tasks').then(function (tasks) {
            this.tasks = tasks
        })

    })

    it('register a new task', function () {
        const { user, task } = this.tasks.create

        // deletando e criando o usuário
        cy.task('deleteUser', user.email)
        cy.postUser(user)

        // fazendo login
        cy.postSession(user)
            .then(response => {
                // excluindo a task caso já exista
                cy.task('deleteTask', task.name, user.email)

                cy.postTask(task, response.body.toke)
                    .then(response => {
                        expect(response.status).to.eq(200)
                        expect(response.body.name).to.eq(task.name)
                        expect(response.body.tags).to.eq(task.tags)
                    })

            })
    })
})