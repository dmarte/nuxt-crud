<template>
  <v-menu
    ref="menu"
    v-model="opened"
    :close-on-content-click="false"
    min-width="auto"
    offset-y
    transition="scale-transition"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-bind="attrs"
        :disabled="disabled"
        :error-messages="response.feedback(name)"
        :label="label"
        :readonly="!disabled"
        :value="displayFormat(value)"
        :dense="dense"
        outlined
        v-on="on"
      />
    </template>
    <v-date-picker
      ref="picker"
      :active-picker.sync="activePicker"
      :disabled="disabled"
      :max="resolveMinOrMaxValue(params.max)"
      :min="resolveMinOrMaxValue(params.min)"
      :value="storeFormat(value)"
      no-title
      @change="change"
    />
  </v-menu>
</template>

<script>
import field from '../../mixins/resource/field'
import date from '../../mixins/date'

export default {
  name: 'CFieldDateForm',
  mixins: [field, date],
  data () {
    return {
      opened: false,
      activePicker: 'DATE'
    }
  },
  watch: {
    opened (val) {
      val && setTimeout(() => (this.activePicker = this.params.display || 'DATE'))
    }
  },
  methods: {
    change (date) {
      this.whenChange(date)
      setTimeout(() => this.$refs.menu.save())
    }
  }
}
</script>

<style scoped></style>
