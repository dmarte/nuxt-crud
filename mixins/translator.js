export default {
  methods: {
    /**
     * Ge the translation of a given translation key Only if exists.
     *
     * @param {String} label
     * @param {Number} position
     * @param {Object} placeholders
     * @param {any} defaultValue
     * @returns {String}
     */
    getTranslation(
      label,
      position = 1,
      placeholders = {},
      defaultValue = undefined
    ) {
      if (this.$te(label)) {
        return this.$tc(label, position, placeholders).toString()
      }

      if (typeof defaultValue !== 'undefined') {
        return defaultValue
      }

      return label
    },
    /**
     * Get the translation for the resource.
     *
     * @param {String} module
     * @param {Number} position
     * @returns {String}
     */
    getTranslationForResource(module, position = 1) {
      const message =
        this.getTranslation(`crud.module.${module}.resource`, position) ||
        this.getTranslation('crud.title.resource', 1)
      if (message) {
        return message
      }
      return module
    },
    /**
     * Get the translation for the resource in the singular form.
     *
     * @param {String} module
     * @returns {String}
     */
    getTranslationForResourceSingular(module) {
      return this.getTranslationForResource(module, 1)
    },
    /**
     * Get the translation in the plural form.
     *
     * @param {String} module
     * @returns {String}
     */
    getTranslationForResourcePlural(module) {
      return this.getTranslationForResource(module, 2)
    },
    getTranslationForField(
      module,
      name,
      type = 'attribute',
      defaultValue = undefined
    ) {
      return (
        this.getTranslation(`crud.module.${module}.${type}.${name}`, 1, {} ,null) ||
        this.getTranslation(`crud.${type}.${name}`, 1, {}, null) ||
        this.getTranslation(`${type}.${name}`, 1, {}, defaultValue)
      )
    },
    getTranslationForFieldLabel(module, fieldName, fieldLabel = null) {
      return this.getTranslationForField(
        module,
        fieldName,
        'attribute',
        fieldLabel
      )
    },
    getTranslationForFieldPlaceholder(module, fieldName) {
      return this.getTranslationForField(module, fieldName, 'placeholder', null)
    },
    getTranslationForFieldHint(module, fieldName) {
      return this.getTranslationForField(module, fieldName, 'hint', null)
    },
    getTranslationForAction(module, type) {
      const placeholders = {
        resource: this.getTranslationForResourceSingular(module),
      }
      return (
        this.getTranslation(
          `crud.module.${module}.message.${type}`,
          1,
          placeholders
        ) || this.getTranslation(`crud.message.${type}`, 1, placeholders)
      )
    },
    getTranslationForSuccessUpdate(module) {
      return this.getTranslationForAction(module, 'update')
    },
    getTranslationForSuccessCreate(module) {
      return this.getTranslationForAction(module, 'create')
    },
    getTranslationForSuccessDestroy(module) {
      return this.getTranslationForAction(module, 'destroy')
    },
  },
}
