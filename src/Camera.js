const assign = require('object-assign')

module.exports = Camera

// Stores position and zoom level of the camera.
function Camera(opts = {}) {
  if (!(this instanceof Camera)) return new Camera(opts)

  this.x = opts.x
  this.y = opts.y
  this.zoom = opts.zoom
}

assign(Camera.prototype, {

  // Nothing much yet

})
