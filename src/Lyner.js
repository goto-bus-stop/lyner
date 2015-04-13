import Line from './Line'
import Cell from './Cell'
import Camera from './Camera'
import Grid from './Grid'
import RenderCache from './RenderCache'
import RenderCell from './RenderCell'
import { createCanvas, getCells } from './util'
import assign from 'object-assign'

// exports
Lyner.Camera = Camera
Lyner.Cell = Cell
Lyner.Grid = Grid
Lyner.Line = Line
Lyner.Lyner = Lyner
Lyner.RenderCache = RenderCache
Lyner.RenderCell = RenderCell

// Sets up a new lyner instance.
export default function Lyner(opts = {}) {
  if (!(this instanceof Lyner)) return new Lyner(opts)

  this.camera = opts.camera instanceof Camera
              ? opts.camera
              : Camera(opts.camera || { x: 0, y: 0, zoom: 1 })
  this.viewport = opts.canvas
                ? { width: opts.canvas.width
                  , height: opts.canvas.height }
                : { width: opts.width || 640
                  , height: opts.height || 480 }
  this.canvas = opts.canvas || createCanvas(this.viewport)
  this.context = this.canvas.getContext('2d')

  this.grid = Grid(opts)
}

assign(Lyner.prototype, {

  // Creates and adds a line from (x0, y0) to (x1, y1).
  line(x0, y0, x1, y1, opts = {}) {
    const line = Line(x0, y0, x1, y1, opts)
    this.add(line)
    return line
  },

  add(line) {
    this.grid.add(line)
  },

  // Removes a line.
  // Pass in a line instance created with lyner#line.
  remove(line) {
    this.grid.remove(line)
  },

  clear() {
    this.context.clearRect(0, 0, this.viewport.width, this.viewport.height)
  },

  renderCache() { return this.grid.renderCache },

  // Returns an array of all grid cells that are currently visible on the canvas.
  visibleCells() {
    const z = 1 / this.camera.zoom
    const cs = this.grid.cellSize
    const left   = Math.floor((this.camera.x - this.viewport.width  / 2 * z) / cs)
    const top    = Math.floor((this.camera.y - this.viewport.height / 2 * z) / cs)
    const right  = Math.ceil ((this.camera.x + this.viewport.width  / 2 * z) / cs) + 1
    const bottom = Math.ceil ((this.camera.y + this.viewport.height / 2 * z) / cs) + 1

    const cells = []
    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        cells.push(this.grid.cell(x, y))
      }
    }

    return cells
  },

  draw() {
    const cam = this.camera
    const ctx = this.context
    const ct = { x: this.viewport.width / 2
               , y: this.viewport.height / 2 }
    const rc = this.renderCache()
    const cs = this.grid.cellSize
    this.visibleCells().forEach(cell => {
      const c = rc.cell(cell.x / cs, cell.y / cs).draw(cell.lines, cam)
      ctx.drawImage(c,
                    Math.floor((cell.x - cam.x) * cam.zoom + ct.x),
                    Math.floor((cell.y - cam.y) * cam.zoom + ct.y))
    })
  },

  zoom(ticks) {
    this.camera.zoom *= Math.pow(1.1, -ticks)
    this.renderCache().clear()
  }

})
