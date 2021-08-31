import CrudResponse from '../libs/CrudResponse'
import _ from 'lodash'
export default {
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object, Boolean],
      default: null,
    },
    module: {
      type: String,
      default: 'general',
    },
    id: {
      type: String,
      default() {
        return `text_field_id_${this._uid}`
      },
    },
    name: {
      type: String,
      default() {
        return `text_field_${this._uid}`
      },
    },
    label: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    response: {
      type: CrudResponse,
      required: true,
    },
  },
  computed: {
    head() {
      return this.$attrs.params.head
    },
    model() {
      return this.$attrs.params.model
    },
  },
  methods: {
    whenChange(value) {
      this.response.forget(this.name)
      this.$emit('input', value)
    },
  },
}
