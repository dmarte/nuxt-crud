<template>
  <span>
    {{ displayFormat(value) }}
  </span>
</template>

<script>
import field from '../../mixins/resource/field'
import date from '../../mixins/date'
export default {
  name: 'CFieldDateIndex',
  mixins: [field, date]
}
</script>

<style scoped>

</style>
