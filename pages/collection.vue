<template>
  <c-ui-collection
    :module="module"
    :headers="headers"
    :form-fullscreen="current.fullscreen"
  />
</template>

<script>
import CUiCollection from '../components/ui/Collection'
import crud from '../mixins/crud'
export default {
  name: 'collection',
  mixins: [crud],
  props: {
    module: { type: String },
  },
  components: { CUiCollection },
  methods: {
    getDisplayMode() {
      return this.DISPLAY_MODE_INDEX
    }
  }
}
</script>

<style scoped></style>
