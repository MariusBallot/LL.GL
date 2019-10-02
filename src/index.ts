import './stylus/index.styl';

import Renderer3D from './components/Renderer3D'
let canvas: HTMLCanvasElement = document.querySelector('#c')
let renderer3D = new Renderer3D(canvas)

function update() {
  renderer3D.draw()
  requestAnimationFrame(update)
}

update()