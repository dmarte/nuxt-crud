<template>
  <h3 class="my-3">
    {{ label }}
  </h3>
</template>

<script>
import field from '../../mixins/field'
export default {
  name: 'CFieldHeading',
  mixins: [field]
}
</script>

<style scoped></style>
