var queryString = require('query-string')
var raw = require('choo/html/raw')
var html = require('choo/html')
var ok = require('object-keys')
var xtend = require('xtend')
var path = require('path')

module.exports = wrapper

function wrapper (view) {
  return function (state, emit) {
    var href = state.query.url || '/'
    var page = state.content[href] || { }

    return html`
      <body class="fs1 ff-sans x xdc vhmn100" style="padding-left: 7rem">
        ${view(xtend(state, { page: page }), emit)}
        ${state.enoki.loading ? loading() : ''}
      </body>
    `
  }
}


function loading () {
  return html`
    <div class="psf l0 b0" style="z-index: 99;">
      <div class="loader"></div>
    </div>
  `
}
