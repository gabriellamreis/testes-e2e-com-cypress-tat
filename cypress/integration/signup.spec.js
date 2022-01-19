/// <reference path="../support/commands.d.ts" />

it('successfully signs up using confirmation code sent via email', () => {

  const faker = require('faker')
  const emailAddress = `${faker.datatype.uuid()}@${Cypress.env('MAILOSAUR_SERVER_ID')}.mailosaur.net`
  const password = Cypress.env('USER_PASSWORD')

  cy.intercept('GET', '**/notes').as('getNotes') // requisição para pegar as anotações já existentes
  cy.fillSignupFormAndSubmit(emailAddress, password)

  cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
    sentTo: emailAddress
  }).then(message => {
    const confirmationCode = message.html.body.match(/\d{6}/)[0] // pega os 6 primeiros dígitos do email
    cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)

    cy.wait('@getNotes') // espera a requisição terminar
    cy.contains('h1', 'Your Notes').should('be.visible')
  })
})