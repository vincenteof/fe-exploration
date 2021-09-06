import multiply from './multiply.js'

const PI = 3.141

export default function area(radius) {
  return multiply(PI, radius, radius)
}