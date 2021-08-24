import CrudResponse from '../libs/CrudResponse'
import _ from 'lodash'
export default {
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object, Boolean],
      default: null
    },
    id: {
      type: String,
      default() {
        return `text_field_id_${this._uid}`
      }
    },
    name: {
      type: String,
      default() {
        return `text_field_${this._uid}`
      }
    },
    label: {
      type: String,
      default() {
        return this.$te(`attributes.${this.name}`) ? this.$t(`attributes.${this.name}`) : this.name
      }
    },
    placeholder: {
      type: String,
      default() {
        return this.label
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    response: {
      type: CrudResponse,
      required: true
    }
  },
  computed: {
    head() {
      return this.$attrs.params.head
    },
    model() {
      return this.$attrs.params.model
    }
  },
  methods: {
    whenChange(value) {
      this.response.forget(this.name)
      this.$emit('input', value)
    }
  }
}
