var Nanocomponent = require('nanocomponent')
var ColorPicker = require('simple-color-picker')
var html = require('choo/html')
var css = require('sheetify')
var xtend = require('xtend')

var style = css`
  :host label {
    border-radius: 1.75rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    right: 0;
    margin: 0.5rem;
    height: 3rem;
    width: 6rem;
  }
`

module.exports = class Color extends Nanocomponent {
  constructor () {
    super()
    this.state = {
      id: '',
      value: ''
    }

    this.onInput = this.onInput.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  load (element) {
    var self = this

    this.colorPicker = new ColorPicker({
      color: this.state.value.toLowerCase(),
      el: element,
      width: 200,
      height: 200
    })

    this.colorPicker.onChange(function (data) {
      self.onInput({ target: { value: data.toLowerCase() }})
    })

    this.colorPicker.$el.style.display = 'none'
  }

  unload (element) {
    if (this.colorPicker) {
      this.colorPicker.remove()
    }
  }

  createElement (props, emit) {
    this.state = xtend(this.state, props)
    this.emit = emit

    return html`
      <div class="${style} psr">
        <input
          name="${this.state.key}"
          class="input py1 px1-5"
          type="text"
          value="${this.state.value}"
          oninput=${this.onInput}
          onfocus=${this.onFocus}
          onblur=${this.onBlur}
          ${this.state.required ? 'required' : ''}
        />
        <label style="background: ${this.state.value}"></label>
        ${this.colorPicker ? this.colorPicker.$el : ''}
      </div>
    `
  }

  onInput (event) {
    var value = event.target.value.toLowerCase()
    if (this.state.value !== value) {
      this.emit({ value: value })
    }
  }

  onFocus (event) {
    this.colorPicker.$el.style.display = 'flex'
  }

  onBlur (event) {
    this.colorPicker.$el.style.display = 'none'
  }

  update (props, emit) {
    this.state = xtend(this.state, props)

    if (this.colorPicker) {
      this.colorPicker.setColor(props.value.toLowerCase())
    }

    return this.state.value !== props.value
  }
}
