function ExtendableError(message) {
  this.name = this.constructor.name
  this.message = message || `Error: ${this.name}`
  this.stack = (new Error()).stack
}
ExtendableError.prototype = Object.create(Error.prototype)
ExtendableError.prototype.constructor = ExtendableError

export default ExtendableError