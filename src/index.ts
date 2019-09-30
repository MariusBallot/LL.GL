import './stylus/index.styl';

import Renderer from './components/Renderer'
let canvas: HTMLCanvasElement = document.querySelector('#c')
let renderer = new Renderer(canvas)

function update() {
  // renderer.draw()
  requestAnimationFrame(update)
}

update()