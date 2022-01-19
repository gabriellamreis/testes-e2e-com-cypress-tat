/// <reference types="cypress" />

module.exports = (on, config) => {
  require('cypress-grep/src/plugin')(config)
}