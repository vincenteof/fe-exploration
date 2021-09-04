export default function multiply(...args) {
  return args.reduce((acc, cur) => acc * cur)
}