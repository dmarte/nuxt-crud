<template>
  <span>{{ phoneFormat(value) }}</span>
</template>

<script>
import field from '../../mixins/field'
import phones from '../../mixins/phones'
export default {
  name: 'PhoneIndex',
  mixins: [field, phones]
}
</script>

<style scoped>

</style>
