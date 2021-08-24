<template>
  <input type='hidden' :value='value' />
</template>

<script>
import field from '../../mixins/field'

export default {
  name: 'CFieldHidden',
  mixins: [field]
}
</script>

<style scoped>

</style>
