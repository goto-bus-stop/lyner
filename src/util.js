function Pt(x, y) { this.x = x, this.y = y }

const { floor, round, ceil } = Math

// creates a canvas element in the browser or a Canvas
// instance on the server
export function createCanvas({ width, height }) {
  if (typeof document === 'object' && typeof document.createElement === 'function') {
    const cv = document.createElement('canvas')
    cv.width = width
    cv.height = height
    return cv
  }
  const Canvas = require('canvas')
  return new Canvas(width, height)
}


export function getCells(x0, y0, x1, y1, cs = 1) {
  const intersects = []
  // dy / dx
  const factor = (y1 - y0) / (x1 - x0)
  // (sign of dx; sign of dy)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  const endx = floor(x1 / cs)
  const endy = floor(y1 / cs)

  let lastx = x0
  let lasty = y0
  intersects.push(new Pt(lastx, lasty))
  while (floor(lastx / cs) !== endx ||
         floor(lasty / cs) !== endy) {
    // x = the coordinate to the {left|right} of the current cell (on the border between current and next)
    let to1x = sx < 0
             ? round(ceil((lastx + 1) / cs + sx) * cs) - 1
             : round(floor(lastx / cs + sx) * cs)
    // y = the y coordinate of the intersection on that line
    // `(to1.x - x0) * factor` is the distance traveled along y between
    // starting point and current x
    let to1y = round(y0 + (to1x - x0) * factor)

    // y = the coordinate to the {top|bottom} of the current grid box (on the border)
    let to2y = sy < 0
             ? round(ceil((lasty + 1) / cs + sy) * cs) - 1
             : round(floor(lasty / cs + sy) * cs)
    // x = the x coordinate of the intersection on that line
    let to2x = round(x0 + (to2y - y0) / factor)
    // this checks which of the next grid cells is closer to the current one
    // this is because we might have something like this:
    // +--------------+
    // |\   |    |    |   Then both cells P and Q will be found in to1 and
    // | \  | P  |    |   to2, so to get the bottom one in this case, we
    // +--\-+----+----+   find the one that's closest to the starting point.
    // |   \|    |    |
    // | Q  \    |    |
    // +--------------+
    if ((to1x - x0) * (to1x - x0) + (to1y - y0) * (to1y - y0) <
        (to2x - x0) * (to2x - x0) + (to2y - y0) * (to2y - y0)) {
      lastx = to1x
      lasty = to1y
    }
    else {
      lastx = to2x
      lasty = to2y
    }
    intersects.push(new Pt(lastx, lasty))
  }

  return intersects
}