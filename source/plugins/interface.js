var draggableCount = 0
var renderTimeout
var dragTimeout

var _package = require('../package.json')

module.exports = ui

async function ui (state, emitter) {
  state.ui = {
    history: getHistoryDefaults(),
    version: _package.version,
    dragActive: false
  }

  state.events.UI_HISTORY = 'ui:history'
  state.events.UI_HISTORY_RESET = 'ui:history:reset'

  emitter.on(state.events.UI_HISTORY_RESET, handleHistoryReset)
  emitter.on(state.events.UI_HISTORY, handleHistory)
  // emitter.on(state.events.DOMCONTENTLOADED, handleLoad)

  function handleHistory (data) {
    if (!data.route || !data.path) return
    state.ui.history[data.route] = data.path
  }

  function handleHistoryReset () {
    state.history = getHistoryDefaults()
  }

  function handleLoad (data) {
    document.body.addEventListener('dragenter', handleDrag, false)
    window.addEventListener('dragend', handleDragEnd, false)
    window.addEventListener('drag', handleDrag, false)
    window.addEventListener('drop', handleDragEnd, false)
  }

  function handleDrag () {
    if (!state.ui.dragActive) {
      clearTimeout(dragTimeout)
      dragTimeout = setTimeout(handleDragEnd, 500)
      state.ui.dragActive = true
      emitter.emit(state.events.RENDER)
    }
  }

  function handleDragEnd (event) {
    if (event) event.preventDefault()
    state.ui.dragActive = false
    clearTimeout(dragTimeout)
    renderTimeout = setTimeout(function () {
      if (!state.ui.dragActive) emitter.emit(state.events.RENDER)
    }, 100)
  }
}

function getHistoryDefaults () {
  return {
    hub: 'guides',
    sites: 'all',
    editor: '/'
  }
}