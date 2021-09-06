<template>
  <h3 class='my-3'>
      {{ getLabel(name) }}
  </h3>
</template>

<script>
import field from '../../mixins/field'
export default {
  name: 'CFieldHeading',
  mixins:[field],
  methods: {
    getLabel(name) {
      const key = `crud.module.${this.module}.attribute.${name}`
      if (this.$te(key)) {
        return this.$t(key)
      }
      if (this.$te(name)) {
        return this.$t(name)
      }
      return name
    }
  }
}
</script>

<style scoped></style>
