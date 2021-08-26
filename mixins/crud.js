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
    }
  },
  methods: {
    getCurrentModule() {
      return this.getModuleData(this.module)
    },
    getVisibleHeads(module, schema = {}) {
      return module.head.filter(head =>this.isVisible(head, schema))
    },
    getVisibleHeaders() {
      return this.getVisibleHeads(this.getCurrentModule(), {}).map(this.mapHeadToTableHeader)
    },
    getVisibleFields(schema = {}) {
      return this.getVisibleHeads(this.getCurrentModule(), schema).map(head => this.mapHeadToField(head, schema))
    },
    /**
     * Get the current display mode.
     * @returns {String}
     */
    getDisplayMode() {
      return this.displayMode || this.DISPLAY_MODE_DETAIL
    },
    /**
     * Build the schema based on fields defined.
     * @returns {{}}
     */
    schema() {
      const out = {}
      this.getVisibleFields(this.value).forEach((field) => {
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
      let text = this.$te(`attributes.${head.name}`)
        ? this.$t(`attributes.${head.name}`)
        : head.name
      if (this.$te(`custom.${this.module}.${head.name}`)) {
        text = this.$t(`custom.${this.module}.${head.name}`)
      }
      return {
        text: text,
        value: head.name,
        sortable: head.sortable,
      }
    },
    /**
     * Transform the current selected field
     * to Vuetify field binding properties.
     *
     * @param {Object} head
     * @param {Object} schema
     * @returns {Object}
     */
    mapHeadToField(head, schema) {
      return head
    },
    /**
     * Get the default value assigned to a given field.
     * @param {Object} field
     * @returns {any}
     */
    getFieldDefaultValue(field) {
      if (!field || !field.settings) {
        return null
      }
      if (field.settings.valueState) {
        return _.get(
          this.$store.state,
          field.settings.valueState,
          field.settings.value
        )
      }
      if (field.settings.valueGetter) {
        return _.get(
          this.$store.state,
          field.settings.valueGetter,
          field.settings.value
        )
      }
      return field.settings.value
    },
    /**
     * Get settings of a given module.
     *
     * @param {String} module
     * @returns {CrudModule.$options}
     */
    getModuleData(module) {
      return this.$crud.modules.find(({ name }) => name === module)
    },
    /**
     * Validate the visibility of a given field based on the value of another
     * field (if configured).
     * @param {CrudHead.$options} field
     * @param {Object} schema
     * @returns {Boolean}
     */
    isVisibleWhenDependsOnOtherField(field, schema = {}) {
      if (!field.settings.visibility.when_field_name) {
        return true
      }
      const value = _.get(
        schema,
        field.settings.visibility.when_field_name,
        null
      )
      if (field.settings.visibility.when_field_value === null && value) {
        return true
      }

      return field.settings.visibility.when_field_value.includes(value)
    },
    /**
     * Verify the visibility of a given field.
     *
     * @param {CrudHead.$options} field
     * @param {Object} schema
     * @returns {boolean}
     */
    isVisible(field, schema = {}) {
      let visible = false
      switch (this.getDisplayMode()) {
        case this.DISPLAY_MODE_FORM:
          if (this.isUpdating && field.settings.visibility.updating) {
            visible = true
          }
          if (this.isCreating && field.settings.visibility.creating) {
            visible = true
          }
          break
        case this.DISPLAY_MODE_INDEX:
          visible = field.settings.visibility.index
          break
        case this.DISPLAY_MODE_DETAIL:
          visible = field.settings.visibility.detail
          break
      }

      return visible
        ? this.isVisibleWhenDependsOnOtherField(field, schema)
        : false
    },
  },
}
