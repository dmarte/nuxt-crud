<template>
  <v-menu
    ref="menu"
    v-model="opened"
    :close-on-content-click="false"
    min-width="auto"
    transition="scale-transition"
    offset-y
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-bind="attrs"
        :disabled="disabled"
        :error-messages="response.feedback(name)"
        :label="label"
        :readonly="!disabled"
        :value="displayFormat(value)"
        v-on="on"
      />
    </template>
    <v-date-picker
      ref="picker"
      no-title
      :disabled="disabled"
      :value="storeFormat(value)"
      :max="resolveMinOrMaxValue(max)"
      :min="resolveMinOrMaxValue(min)"
      @change="whenChange"
    />
  </v-menu>
</template>

<script>
import date from '../../mixins/date'

export default {
  name: 'CFieldDate',
  mixins: [date],
  data () {
    return {
      opened: false
    }
  },
  methods: {
    whenChange (value) {
      this.$emit('input', value)
      this.$refs.menu.save(value)
    }
  }
}
</script>

<style scoped></style>
