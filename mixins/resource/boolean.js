export default {
  computed: {
    isTruthy() {
      return this.params.trueValue === this.value
    },
    isFalsy() {
      return this.params.falseValue === this.value
    },
    icon() {
      return this.isTruthy ? 'mdi-check' : 'mdi-block-helper'
    }
  }
}
