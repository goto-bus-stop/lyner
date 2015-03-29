import { createCanvas } from './util'
import assign from 'object-assign'

export default function Cell(x, y, opts = {}) {
  if (!(this instanceof Cell)) return new Cell(x, y, opts)

  this.x = x
  this.y = y
  this.width = opts.width != null ? opts.width
             : opts.size  != null ? opts.size
             : 100
  this.height = opts.height != null ? opts.height
              : opts.size   != null ? opts.size
              : 100
  this.lines = []
}

assign(Cell.prototype, {

  clear() {
    this._canvas = null
  },

  draw(cam) {
    if (this._canvas) return this._canvas

    const canvas = createCanvas({ width: this.width * cam.zoom
                                , height: this.height * cam.zoom })
    const ctx = canvas.getContext('2d')
    this._draw(ctx,
               // camera
               { x: this.x + this.width / 2
               , y: this.y + this.height / 2
               , zoom: cam.zoom },
               // viewport
               { width: this.width * cam.zoom
               , height: this.height * cam.zoom })
    this._canvas = canvas
    return canvas
  },

  _draw(ctx, cam, viewport) {
    const center = { x: viewport.width / 2
                   , y: viewport.height / 2 }

    this.lines.forEach(line => {
      ctx.beginPath()
      ctx.strokeStyle = line.color
      ctx.lineWidth = line.width * cam.zoom
      ctx.moveTo((line.x0 - cam.x) * cam.zoom + center.x,
                 (line.y0 - cam.y) * cam.zoom + center.y)
      ctx.lineTo((line.x1 - cam.x) * cam.zoom + center.x,
                 (line.y1 - cam.y) * cam.zoom + center.y)
      ctx.stroke()
    })
  }

})