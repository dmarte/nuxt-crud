<template>
  <component
    v-bind="$attrs"
    :is="block"
    :module="module"
    :value="value"
    v-on="$listeners"
  />
</template>

<script>
import Vue from 'vue'
import module from '../../mixins/module'

export default {
  name: 'CUiFieldRender',
  mixins: [module],
  props: {
    displayMode: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    value: {
      type: [Array, Object, String, Number, Boolean],
      default: null,
    },
    component: {
      type: String,
      required: true,
    },
  },
  computed: {
    block() {
      const allowed = ['CFieldHeading']
      if (allowed.includes(this.component)) {
        return this.component
      }

      let suffix = this.getModuleDisplayMode()
      if (this.isModuleInFormMode(this.module)) {
        suffix = ''
      }
      let component = `${this.component}${suffix}`
      // If no component registered
      // then render the generic
      if (component in Vue.options.components) {
        return component
      }

      return `CFieldText${this.DISPLAY_MODE_DETAIL}`
    },
  },
}
</script>
