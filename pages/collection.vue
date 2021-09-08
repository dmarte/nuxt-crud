<template>
  <c-ui-collection
    :module="module"
    :form-fullscreen="settings.fullscreen"
    :headers='columns()'
    :actions='getModuleActions(module)'
    :title='getModulePageTitle(module)'
    :dense='settings.dense'
    :display-mode='DISPLAY_MODE_INDEX'
    :value='collection'
    :busy='$fetchState.pending'
    :response='response'
    @refresh='$fetch'
    @search='whenSearching'
    @sort:desc='sortDesc'
    @sort:by='sortBy'
  />
</template>

<script>
import CUiCollection from '../components/ui/Collection'
import collection from '../mixins/pageCollection'
export default {
  name: 'PageCrudCollection',
  components: { CUiCollection },
  mixins: [collection],
  props: {
    module: { type: String, required: true },
  },
  async fetch() {
    await this.collect()
  },
  computed: {
    settings() {
      return this.getModuleSettings(this.module)
    }
  }
}
</script>

<style scoped></style>
