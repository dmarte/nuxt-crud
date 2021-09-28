<template>
  <v-list-item>
    <v-list-item-subtitle>{{ label }}</v-list-item-subtitle>
    <v-list-item-title>{{ currentValue }}</v-list-item-title>
  </v-list-item>
</template>

<script>
import field from '../../mixins/field'
import select from '../../mixins/select'
export default {
  name: 'CFieldSelectDetail',
  mixins: [field, select]
}
</script>

<style scoped>

</style>
