<template>
  <v-list-item>
    <v-list-item-subtitle>{{ label }}</v-list-item-subtitle>
    <v-list-item-title>{{ displayFormat(value) }}</v-list-item-title>
  </v-list-item>
</template>

<script>
import field from '../../mixins/resource/field'
import date from '../../mixins/date'
export default {
  name: 'CFieldDateDetail',
  mixins: [field, date]
}
</script>

<style scoped>

</style>
