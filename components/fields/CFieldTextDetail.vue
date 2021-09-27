<template>
  <v-list-item>
    <v-list-item-subtitle>{{ label }}</v-list-item-subtitle>
    <v-list-item-title>{{ value }}</v-list-item-title>
  </v-list-item>
</template>

<script>
import field from '../../mixins/resource/field'
export default {
  name: 'CFieldTextDetail',
  mixins: [field]
}
</script>

<style scoped>

</style>
