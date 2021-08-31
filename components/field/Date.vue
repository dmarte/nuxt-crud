<template>
  <v-menu
    ref='menu'
    v-model='opened'
    :close-on-content-click='false'
    transition='scale-transition'
    min-width='auto'
    offset-y
  >
    <template #activator='{ on, attrs }'>
      <v-text-field
        :value='$moment(value).short()'
        :label="label"
        :error-messages='response.feedback(name)'
        :disabled='disabled'
        :readonly='!disabled'
        v-bind='attrs'
        v-on='on'
      />
    </template>
    <v-date-picker
      ref='picker'
      :value='value'
      :max='new Date().toISOString().substr(0, 10)'
      :active-picker.sync='mode'
      min='1950-01-01'
      @change='whenChange'
    />
  </v-menu>
</template>

<script>
import OgResponse from '../../libs/CrudResponse'
import field from '../../mixins/field'
export default {
  name: 'CFieldBirthday',
  mixins:[field],
  props: {
    value: {
      type: String,
      default() {
        return this.$moment().subtract(1, 'year').format('YYYY-MM-DD')
      }
    },
    name: {
      type: String,
      default: 'birthday'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    response: {
      type: OgResponse,
      required: true
    }
  },
  data() {
    return {
      opened: false,
      mode: 'YEAR'
    }
  },
  watch: {
    opened(val) {
      if (val) {
        setTimeout(() => (this.mode = 'YEAR'))
      }
    }
  },
  methods: {
    whenChange(value) {
      this.$emit('input', value)
      this.$refs.menu.save(value)
    }
  }
}
</script>

<style scoped>

</style>
