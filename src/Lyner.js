import Line from './Line'
import Cell from './Cell'
import Camera from './Camera'
import { createCanvas, getCells } from './util'
import assign from 'object-assign'

export default function Lyner(opts = {}) {
  if (!(this instanceof Lyner)) return new Lyner(opts)

  this.camera = Camera(opts.camera || { x: 0, y: 0, zoom: 1 })
  this.viewport = opts.canvas ? { width: opts.canvas.width
                                , height: opts.canvas.height }
                : { width: opts.width || 640
                  , height: opts.height || 480 }
  this.canvas = opts.canvas || createCanvas(this.viewport)
  this.context = this.canvas.getContext('2d')

  this.cellSize = opts.cellSize || 100

  this._grid = {}
}

assign(Lyner.prototype, {

  line(x0, y0, x1, y1, opts = {}) {
    const line = Line(x0, y0, x1, y1, opts)
    this.add(line)
    return line
  },

  add(line) {
    this._findCellsFor(line).forEach(cell => {
      cell && cell.lines.push(line)
    })
  },

  _cell(x, y) {
    const key = `${x},${y}`
    return this._grid[key] ||
      (this._grid[key] = Cell(x * this.cellSize, y * this.cellSize, { size: this.cellSize }))
  },

  _findCellsFor(line) {
    const cs = this.cellSize
    return getCells(line.x0, line.y0,
                    line.x1, line.y1, cs).map(({ x, y }) => {
      return this._cell(Math.floor(x / cs), Math.floor(y / cs))
    })
  },

  clear() {
    this.context.clearRect(0, 0, this.viewport.width, this.viewport.height)
  },

  visibleCells() {
    const z = 1 / this.camera.zoom
    const cs = this.cellSize
    const left   = Math.floor((this.camera.x - this.viewport.width  / 2 * z) / cs)
    const top    = Math.floor((this.camera.y - this.viewport.height / 2 * z) / cs)
    const right  = Math.ceil ((this.camera.x + this.viewport.width  / 2 * z) / cs) + 1
    const bottom = Math.ceil ((this.camera.y + this.viewport.height / 2 * z) / cs) + 1

    const cells = []
    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        cells.push(this._cell(x, y))
      }
    }

    return cells
  },

  draw() {
    const cam = this.camera
    const ctx = this.context
    const ct = { x: this.viewport.width / 2
               , y: this.viewport.height / 2 }
    this.visibleCells().forEach(cell => {
      const c = cell.draw(cam)
      ctx.drawImage(c,
                    Math.floor((cell.x - cam.x) * cam.zoom + ct.x),
                    Math.floor((cell.y - cam.y) * cam.zoom + ct.y))
    })
  },

  zoom(ticks) {
    this.camera.zoom *= Math.pow(1.1, -ticks)
    Object.keys(this._grid).forEach(k => this._grid[k].clear())
  }

})