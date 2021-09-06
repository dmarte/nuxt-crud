import Vue from 'vue'
import pluralize from 'pluralize'

export default {
  props: {
    // VUEX MODULE NAME
    // Used to determine the CRUD operations.
    module: {
      type: String,
      default: ''
    }
  },
  methods: {
    breadcrumbs() {
      return []
    },

    camel(name) {
      if (!name) {
        return ''
      }
      return name
        .split(' ')
        .map((word) => `${word.charAt(0).toUpperCase()}${word.substr(1)}`)
        .join('')
    },
    singular(word) {
      return pluralize.singular(word)
    },
    plural(word) {
      return pluralize.plural(word)
    },
    pascal(name) {
      const value = this.camel(name)
      return `${value.charAt(0).toUpperCase()}${value.substr(1)}`
    },
    form(module, prefix = 'OgForm', suffix = '') {
      return this.pascal(`${prefix}${module}${suffix}`)
    },
    detail(module, prefix = 'OgDetail', suffix = '') {
      return this.form(module, prefix)
    },
    action(name) {
      return [this.module, name].join('/')
    },
    exists(name) {
      return (name in Vue.options.components)
    }
  },
}
