<template>
  <component v-bind='attributes' :is='block' v-on='$listeners' />
</template>

<script>
export default {
  name: 'CUiRenderField',
  props: {
    mode: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({
        name: null,
        label: null,
        value: null,
        is: 'CFieldText',
      }),
    },
  },
  computed: {
    isIndexMode() {
      return this.mode === 'index'
    },
    isDetailMode() {
      return this.mode === 'detail'
    },
    isFormMode() {
      return ['create', 'update'].includes(this.mode)
    },
    hasItems() {
      return typeof this.value.items !== 'undefined'
    },
    attributes() {
      const bind = {
        name: this.value.name,
        label: this.value.label,
        value: this.value.value || null
      }
      if (this.hasItems) {
        bind.items = this.value.items
      }
      return bind
    },
    /**
     * Get the component block that should be displayed.
     *
     * @returns {string}
     */
    block() {
      // List of field allowed to render as it is in any mode.
      const allowed = ['CFieldHeading']

      if (allowed.includes(this.value.is)) {
        return this.value.is
      }

      let prefix = `${this.mode.charAt(0).toUpperCase()}${this.mode.substr(1)}`

      if (this.isFormMode) {
        prefix = ''
      }

      const component = `${this.value.is}${prefix}`

      // If no component registered
      // then render the generic
      if (component in this.$root.$options.components) {
        return component
      }

      return `CFieldDetailText`
    },
  }
}
</script>

<style scoped></style>
