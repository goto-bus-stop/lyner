const gw = require('grid-walk')

// Creates a canvas element in the browser or a Canvas
// instance on the server.
exports.createCanvas = function createCanvas({ width, height }) {
  if (typeof document === 'object' && typeof document.createElement === 'function') {
    const cv = document.createElement('canvas')
    cv.width = width
    cv.height = height
    return cv
  }
  const Canvas = require('canvas')
  return new Canvas(width, height)
}

// Finds all grid cells that intersect with the given line.
exports.getCells = function getCells(start, end, cs = 1) {
  const walker = gw(cs, cs)
  const coords = []
  walker.walk(start, end, ({ row, column }) => {
    coords.push({ x: column, y: row })
  })
  return coords
}
