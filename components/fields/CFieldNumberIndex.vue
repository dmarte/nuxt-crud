<template>
  <span>
    {{ format(value) }}
  </span>
</template>

<script>
import field from './../../mixins/resource/field'
import number from './../../mixins/resource/number'
export default {
  name: 'CFieldNumberIndex',
  mixins: [field, number]
}
</script>

<style scoped>

</style>
