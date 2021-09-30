<template>
  <v-icon>{{ icon }}</v-icon>
</template>

<script>
import field from '../../mixins/resource/field'
import bool from '../../mixins/resource/boolean'
export default {
  name: 'CFieldBooleanIndex',
  mixins:[field, bool]
}
</script>

<style scoped>

</style>
