export function typecheck(obj, definition) {
  return new Proxy(obj, {
    construct(target, [argumentList], newTarget) {
      Object.entries(argumentList).forEach(([key,arg]) => {
        if (definition[key] === 'array') {
          if (!Array.isArray(arg)) {
            throw new TypeError(`Invalid type for ${arg}: expected ${definition[key]}, received ${typeof arg}`)            
          }
        } else if (typeof arg !== definition[key]) {
          throw new TypeError(`Invalid type for ${arg}: expected ${definition[key]}, received ${typeof arg}`)
        }
      })
      return Reflect.construct(target, [argumentList])
    }
  })
}