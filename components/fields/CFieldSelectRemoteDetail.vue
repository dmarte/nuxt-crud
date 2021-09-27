<template>
  <v-list-item>
    <v-list-item-subtitle>{{ label }}</v-list-item-subtitle>
    <v-list-item-title>{{ currentText }}</v-list-item-title>
  </v-list-item>
</template>

<script>
import field from '../../mixins/resource/field'
import remote from '../../mixins/resource/remote'
export default {
  name: 'CFieldSelectRemoteDetail',
  mixins: [field, remote]
}
</script>

<style scoped>

</style>
