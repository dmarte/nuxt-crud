<template>
  <input type="hidden" :name="name" :value="value" @input="whenChange">
</template>

<script>
import field from '../../mixins/resource/field'
export default {
  name: 'CFieldHiddenForm',
  mixins: [field]
}
</script>

<style scoped>

</style>
