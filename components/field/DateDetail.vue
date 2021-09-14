<template>
  <v-list-item :key="`item_${value}`">
    <v-list-item-subtitle>
      {{ label }}
    </v-list-item-subtitle>
    <v-list-item-title>
      <slot>
        {{ displayFormat(value) }}
      </slot>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import date from '../../mixins/date'
export default {
  name: 'DateDetail',
  mixins: [date]
}
</script>

<style scoped>

</style>
