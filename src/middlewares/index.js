export default function() {
  return {
    reqParser: require('./reqParser').default(...arguments)
  }
}
