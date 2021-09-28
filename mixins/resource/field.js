import CrudResponse from '../../libs/CrudResponse'

export default {
  props: {
    params: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: [String, Number, Object, Array],
      default: null
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    hint: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    response: {
      type: CrudResponse,
      required: true
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    whenChange (value) {
      this.response.forget(this.name)
      this.$emit('input', value)
    }
  }
}
