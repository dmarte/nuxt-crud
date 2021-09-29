<template>
  <v-list-item>
    <v-list-item-subtitle>{{ label }}</v-list-item-subtitle>
    <v-list-item-title>
      <v-icon>
        {{ icon }}
      </v-icon>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import field from '../../mixins/resource/field'
import bool from '../../mixins/resource/boolean'
export default {
  name: 'CFieldBooleanDetail',
  mixins:[field,bool]
}
</script>

<style scoped>

</style>
