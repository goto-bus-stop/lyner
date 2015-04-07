import assign from 'object-assign'
import Cell from './Cell'
import RenderCache from './RenderCache'
import { getCells } from './util'

export default function Grid(opts = {}) {
  if (!(this instanceof Grid)) return new Grid(opts)

  this.cellSize = opts.cellSize || 100
  this.renderCache = opts.renderCache || RenderCache({ cellSize: this.cellSize })

  this._grid = {}
}

assign(Grid.prototype, {

  _key(x, y) { return `${x},${y}` },

  cell(x, y) {
    const key = this._key(x, y)
    return this._grid[key] ||
      (this._grid[key] = Cell(x * this.cellSize, y * this.cellSize, { size: this.cellSize }))
  },

  add(line) {
    this._findCellsFor(line).forEach(cell => {
      cell.lines.push(line)
    })
  },

  remove(line) {
    const cs = this.cellSize
    this._findCellsFor(line).forEach(({ x, y, lines }) => {
      for (let i = 0, l = lines.length; i < l; i++) {
        if (lines[i] === line) {
          lines.splice(i, 1)
          i--
          this.renderCache.cell(x / cs, y / cs).clear()
        }
      }
    })
  },

  _findCellsFor(line) {
    const cs = this.cellSize
    return getCells(line.x0, line.y0, line.x1, line.y1, cs)
      .map(({ x, y }) => this.cell(Math.floor(x / cs), Math.floor(y / cs)))
  }

})
