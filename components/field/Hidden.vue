<template>
  <div />
</template>

<script>
import field from '../../mixins/field'

export default {
  name: 'CFieldHidden',
  mixins: [field],
  mounted() {
    this.whenChange(this.value)
  }
}
</script>

<style scoped>

</style>
