import { createCanvas } from './util'
import assign from 'object-assign'

export default function RenderCell(x, y, opts = {}) {
  if (!(this instanceof RenderCell)) return new RenderCell(x, y, opts)

  this.x = x
  this.y = y
  this.width = opts.width != null ? opts.width
             : opts.size  != null ? opts.size
             : 100
  this.height = opts.height != null ? opts.height
              : opts.size   != null ? opts.size
              : 100

  this.clear()
}

assign(RenderCell.prototype, {

  clear() {
    this._canvas = null
    this._drawn = []
  },

  _hasDrawn(lines) { return this._drawn.indexOf(lines) !== -1 },

  draw(lines, cam) {
    if (this._canvas && this._hasDrawn(lines)) return this._canvas

    const canvas = this._canvas ||
                   createCanvas({ width: this.width * cam.zoom
                                , height: this.height * cam.zoom })
    const ctx = canvas.getContext('2d')
    this._draw(lines, ctx,
               // camera
               { x: this.x + this.width / 2
               , y: this.y + this.height / 2
               , zoom: cam.zoom },
               // viewport
               { width: this.width * cam.zoom
               , height: this.height * cam.zoom })

    this._drawn.push(lines)
    this._canvas = canvas
    return canvas
  },

  _draw(lines, ctx, cam, viewport) {
    const center = { x: viewport.width / 2
                   , y: viewport.height / 2 }

    lines.forEach(line => {
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
