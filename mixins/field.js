import CrudResponse from '../libs/CrudResponse'
export default {
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object, Boolean],
      default: null
    },
    params: {
      type: Object,
      default: () => ({})
    },
    module: {
      type: String,
      default: 'general'
    },
    id: {
      type: String,
      default () {
        return `text_field_id_${this._uid}`
      }
    },
    name: {
      type: String,
      default () {
        return `text_field_${this._uid}`
      }
    },
    label: {
      type: String,
      default: null
    },
    min: {
      type: [String, Number],
      default: undefined
    },
    max: {
      type: [String, Number],
      default: undefined
    },
    hint: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    response: {
      type: CrudResponse,
      required: true
    },
    settings: {
      type: Object,
      default: () => ({})
    },
    items: {
      type: Array,
      default: () => []
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    head () {
      return this.$attrs.params.head
    },
    model () {
      return this.$attrs.params.model
    }
  },
  methods: {
    whenChange (value) {
      this.response.forget(this.name)
      this.$emit('input', value)
    }
  }
}
