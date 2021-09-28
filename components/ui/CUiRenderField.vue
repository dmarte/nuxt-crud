<template>
  <component v-bind="attributes" :is="block" v-on="{...$listeners, input: onInput}" />
</template>

<script>
import Vue from 'vue'
import CrudResponse from '../../libs/CrudResponse'

export default {
  name: 'CUiRenderField',
  props: {
    mode: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    response: {
      type: CrudResponse,
      required: true
    },
    value: {
      type: Object,
      default: () => ({
        name: null,
        label: null,
        value: null,
        is: 'CFieldText'
      })
    }
  },
  computed: {
    isFilterMode () {
      return this.mode === 'filter'
    },
    isIndexMode () {
      return this.mode === 'index'
    },
    isDetailMode () {
      return this.mode === 'detail'
    },
    isFormMode () {
      return ['create', 'update'].includes(this.mode)
    },
    hasItems () {
      return typeof this.value.items !== 'undefined'
    },
    requiredPlaceholder () {
      return ['CFieldText', 'CFieldNumber', 'CFieldSelectRemote', 'CFieldTextarea'].includes(this.value.is)
    },
    isNumeric () {
      return this.value.is === 'CFieldNumber'
    },
    suffix () {
      if (this.isFormMode || this.isFilterMode) {
        return 'Form'
      }
      if (this.isDetailMode) {
        return 'Detail'
      }
      if (this.isIndexMode) {
        return 'Index'
      }
      return ''
    },
    attributes () {
      const bind = {
        params: this.value.params || {},
        name: this.value.name || '',
        label: this.value.label || '',
        response: this.response,
        disabled: this.disabled,
        loading: this.loading,
        hint: this.value.hint || '',
        value: this.value.value || '',
        dense: this.dense
      }
      if (this.hasItems) {
        bind.items = this.isFilterMode ? [{ text: '', value: '' }, ...this.value.items] : this.value.items
      }
      if (!bind.value && !this.isFilterMode && this.value.defaultValue !== null) {
        bind.value = this.value.defaultValue
      }
      if (this.requiredPlaceholder) {
        bind.placeholder = this.value.placeholder || ''
      }
      return bind
    },
    /**
     * Get the component block that should be displayed.
     *
     * @returns {string}
     */
    block () {
      // List of field allowed to render as it is in any mode.
      const allowed = ['CFieldHeading']

      if (allowed.includes(this.value.is)) {
        return this.value.is
      }

      return `${this.value.is}${this.suffix}`
    }
  },
  methods: {
    onInput (v) {
      this.$emit('input', { ...this.value, value: v })
    }
  }
}
</script>

<style scoped></style>
