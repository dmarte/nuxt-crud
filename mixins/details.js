import { get, isString } from 'lodash'
import forms from './forms'
export default {
  mixins: [forms],
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
  },
  async fetch() {
    await this.fetchOne()
    this.rows = this.buildRenderHeads()
  },
  data() {
    return {
      rows: [],
    }
  },
  methods: {
    buildRenderHeads() {
      return this.headers.map((header) => ({
        value: undefined,
        label: undefined,
        display: value => value,
        ...header,
        field: this.resolveComponentName(header),
      }))
    },
    resolveLabel(header) {
      if (header.label) {
        return header.label
      }
      return this.$tc(`attributes.${header.value}`)
        ? this.$t(`attributes.${header.value}`)
        : header.value
    },
    resolveComponentName(header) {
      let component = this.$store.getters['fields/TYPE_TEXT']

      if (!header.component) {
        return component
      }
      if (isString(header.component)) {
        return header.component
      }
      return header.component(this.model, header.value)
    },
    get(path, defaults = null) {
      return get(this.model, path, defaults)
    },
    visible(head) {
      if (typeof head.hidden === 'undefined') {
        return true
      }
      return !head.hidden(this.model, head.value)
    },
    whenUpdated(model) {
      this.model = model.data || model
    },
    whenDestroyed() {
      this.$router.push({ name: this.plural(this.module) })
    },
  },
}
