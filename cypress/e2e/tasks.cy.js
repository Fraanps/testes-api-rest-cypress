
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
            .then(userResp => {
                // excluindo a task caso já exista
                cy.task('deleteTask', task.name, user.email)

                cy.postTask(task, userResp.body.token)
                    .then(response => {
                        expect(response.status).to.eq(200)
                        expect(response.body.name).to.eq(task.name)
                        expect(response.body.tags).to.eql(task.tags)
                        expect(response.body.is_done).to.be.false
                        expect(response.body.user).to.eq(userResp.body.user._id)
                        expect(response.body._id.length).to.eq(24)
                    })

            })
    })

    it('duplicate task', function () {
        const { user, task } = this.tasks.dup

        // deletando e criando o usuário
        cy.task('deleteUser', user.email)
        cy.postUser(user)

        // fazendo login
        cy.postSession(user)
            .then(userResp => {
                cy.postTask(task, userResp.body.token)
                cy.postTask(task, userResp.body.token)
                    .then(response => {
                        expect(response.status).to.eq(409)
                        expect(response.body.message).to.eq('Duplicated task!')
                    })

            })
    })
})