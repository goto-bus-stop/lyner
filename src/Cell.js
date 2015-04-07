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

})
