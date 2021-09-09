<template>
  <span>
    {{ displayFormat(value) }}
  </span>
</template>

<script>
import date from '../../mixins/date'
export default {
  name: 'CDateIndex',
  mixins: [date]
}
</script>

<style scoped>

</style>
