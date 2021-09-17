export default {
  props: {
    value: {
      type: [String, Number, Object, Array, null],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }
}
