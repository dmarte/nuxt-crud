<template>
  <v-list-item>
    <v-list-item-subtitle>{{ label }}</v-list-item-subtitle>
    <v-list-item-title>{{ format(value) }}</v-list-item-title>
  </v-list-item>
</template>

<script>
import field from '../../mixins/resource/field'
import number from '../../mixins/resource/number'
export default {
  name: 'CFieldNumberDetail',
  mixins: [field, number]
}
</script>

<style scoped>

</style>
