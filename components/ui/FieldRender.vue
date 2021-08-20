<template>
  <component v-bind="$attrs" :is="block" :module="module" :value='value' v-on="$listeners" />
</template>

<script>
import components from '../../mixins/components'
import crud from '../../mixins/crud'
export default {
  name: 'CUiFieldRender',
  mixins: [components, crud],
  props: {
    displayMode: {
      type: String,
      default() {
        return this.DISPLAY_MODE_FORM
      },
    },
    value: {
      type: [Array, Object, String, Number],
      default: null
    },
    component: {
      type: String,
      required: true,
    },
  },
  computed: {
    block() {
      const suffix =
        this.displayMode === this.DISPLAY_MODE_FORM ? '' : this.displayMode
      let component = this.form(this.component, '', suffix)
      // If no component registered
      // then render the generic
      if (!this.exists(component)) {
        component = this.form('Text', 'CField', this.DISPLAY_MODE_DETAIL)
      }

      return component
    },
  },
}
</script>
