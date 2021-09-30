<template>
  <div>
    {{ params }}
  </div>
</template>

<script>
import field from '../../mixins/resource/field'
export default {
  name: 'CrudFieldTab',
  mixins: [field]
}
</script>

<style scoped>

</style>
