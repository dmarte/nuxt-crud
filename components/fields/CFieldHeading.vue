<template>
  <div class="my-3">
    <h4 class="py-2">
      {{ label }}
    </h4>
  </div>
</template>

<script>
import field from '../../mixins/resource/field'
export default {
  name: 'CFieldHeading',
  mixins: [field]
}
</script>

<style scoped>

</style>
