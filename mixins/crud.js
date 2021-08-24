import CrudHead from '../libs/CrudHead'
import _ from 'lodash'
export default {
  computed: {
    /**
     * @returns {string}
     * @constructor
     */
    DISPLAY_MODE_INDEX() {
      return CrudHead.DISPLAY_MODE_INDEX
    },
    /**
     * @returns {string}
     * @constructor
     */
    DISPLAY_MODE_FORM() {
      return CrudHead.DISPLAY_MODE_FORM
    },
    /**
     * @returns {string}
     * @constructor
     */
    DISPLAY_MODE_DETAIL() {
      return CrudHead.DISPLAY_MODE_DETAIL
    },
    current() {
      return this.getModuleData(this.module)
    },
    headers() {
      return this.current.head.filter(this.visible).map(this.mapHeadToTableHeader)
    },
    fields() {
      return this.getModuleData(this.module).head.filter(this.visible).map(this.mapHeadToField)
    },
  },
  methods: {
    getDisplayMode() {
      return this.displayMode || this.DISPLAY_MODE_DETAIL
    },
    /**
     * Build the schema based on fields defined.
     * @returns {{}}
     */
    schema() {
      const out = {}
      this.fields.forEach((field) => {
        if (!this.visible(field)) { return }
        _.set(out, field.name, _.get(this.value, field.name, field.value))
      })
      return out
    },
    /**
     * Transform the current field head to
     * to Vuetify table head.
     *
     * @param {{name: String}} head
     * @returns {{text, value}}
     */
    mapHeadToTableHeader(head) {
      let text = this.$te(`attributes.${head.name}`) ? this.$t(`attributes.${head.name}`) : head.name
      if (this.$te(`custom.${this.module}.${head.name}`)) {
        text = this.$t(`custom.${this.module}.${head.name}`)
      }
      return {
        text: text,
        value: head.name,
        sortable: head.sortable
      }
    },
    /**
     * Transform the current selected field
     * to Vuetify field binding properties.
     *
     * @param {Object} head
     * @returns {Object}
     */
    mapHeadToField(head) {
      return head
    },
    /**
     *
     * @param {Object} field
     * @returns {any}
     */
    getFieldDefaultValue(field) {
      if (!field || !field.settings) {
        return null
      }
      if (field.settings.valueState) {
        return _.get(this.$store.state, field.settings.valueState, field.settings.value)
      }
      if (field.settings.valueGetter) {
        return _.get(this.$store.state, field.settings.valueGetter, field.settings.value)
      }
      return field.settings.value
    },
    getModuleData(module) {
      return this.$crud.modules.find(({name}) => name === module)
    },
    visible(field) {
      switch (this.getDisplayMode()) {
        case this.DISPLAY_MODE_FORM:
          if (this.isUpdating && !field.settings.visibility.updating) {
            return false
          }
          if (this.isCreating && !field.settings.visibility.creating) {
            return false
          }
          break
        case this.DISPLAY_MODE_INDEX:
          return field.settings.visibility.index
        case this.DISPLAY_MODE_DETAIL:
          return field.settings.visibility.detail
      }
      return true
    },
  },
}
