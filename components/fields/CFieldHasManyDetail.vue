<template>
  <component
    :is="block"
    :mode="mode"
    :parent-resource="params.parentResource"
    :parent-resource-id="params.parentResourceId"
    :resource="params.resource"
    :resource-id="params.resourceId"
    :query="params.query"
    flat
  />
</template>

<script>
import field from '../../mixins/resource/field'
import CrudPageResourceIndex from '../../pages/resource'

export default {
  name: 'CFieldHasMany',
  components: { CrudPageResourceIndex },
  mixins: [field],
  computed: {
    block () {
      return 'CrudPageResourceIndex'
    },
    mode () {
      return 'index'
    }
  }
}
</script>

<style scoped>

</style>
