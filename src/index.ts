import './stylus/index.styl';

import Renderer from './components/Renderer'
let canvas: HTMLCanvasElement = document.querySelector('#c')
new Renderer(canvas)