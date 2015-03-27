import Line from './Line'
import Camera from './Camera'
import assign from 'object-assign'

function createCanvas({ width, height }) {
  if (typeof document === 'object' && typeof document.createElement === 'function') {
    const cv = document.createElement('canvas')
    cv.width = width
    cv.height = height
    return cv
  }
  const Canvas = require('canvas')
  return new Canvas(width, height)
}

export default function Lyner(opts = {}) {
  if (!(this instanceof Lyner)) return new Lyner(opts)

  this.camera = Camera(opts.camera || { x: 0, y: 0, zoom: 1 })
  this.viewport = { width: opts.width || 640
                  , height: opts.height || 480 }
  this.canvas = opts.canvas || createCanvas(this.viewport)
  this.context = this.canvas.getContext('2d')

  this._lines = []
}

assign(Lyner.prototype, {

  line(x0, y0, x1, y1, opts = {}) {
    const line = Line(x0, y0, x1, y1, opts)
    this.add(line)
    return line
  },

  add(line) {
    this._lines.push(line)
  },

  clear() {
    this.context.clearRect(0, 0, this.viewport.width, this.viewport.height)
  },

  draw() {
    const cam = this.camera
    const ctx = this.context
    const center = { x: this.viewport.width / 2
                   , y: this.viewport.height / 2 }
    this._lines.forEach(line => {

      ctx.beginPath()
      ctx.strokeStyle = line.color
      ctx.lineWidth = line.width * cam.zoom
      ctx.moveTo(line.x0 * cam.zoom - cam.x + center.x,
                 line.y0 * cam.zoom - cam.y + center.y)
      ctx.lineTo(line.x1 * cam.zoom - cam.x + center.x,
                 line.y1 * cam.zoom - cam.y + center.y)
      ctx.stroke()

    })
  },

  zoom(ticks) {
    this.camera.zoom *= Math.pow(1.1, -ticks)
  }

})