<template>
  <c-ui-collection
    :actions="getModuleActions(module)"
    :busy="$fetchState.pending"
    :dense="settings.dense"
    :display-mode="DISPLAY_MODE_INDEX"
    :filters="filters()"
    :form-fullscreen="settings.fullscreen"
    :headers="columns()"
    :module="module"
    :paginator-current-page="meta.currentPage"
    :paginator-from="meta.from"
    :paginator-last-page="meta.lastPage"
    :paginator-per-page="meta.perPage"
    :paginator-to="meta.to"
    :paginator-total="meta.total"
    :per-page-preset="settings.perPage"
    :response="response"
    :title="getModulePageTitle(module)"
    :value="collection"
    disable-filtering
    @destroy="destroy"
    @filter="whenFilter"
    @filter-reset="whenFilterReset"
    @paginate="wantsPaginate"
    @refresh="$fetch"
    @search="whenSearching"
    @per-page="wantsPerPage"
    @sort:desc="sortDesc"
    @sort:by="sortBy"
  />
</template>

<script>
import _ from 'lodash'
import CUiCollection from '../components/ui/Collection'
import collection from '../mixins/pageCollection'
export default {
  name: 'PageCrudCollection',
  components: { CUiCollection },
  mixins: [collection],
  props: {
    module: {
      type: String,
      required: true
    }
  },
  async fetch () {
    await this.collect()
  },
  computed: {
    settings () {
      return this.getModuleSettings(this.module)
    }
  },
  methods: {
    async destroy (payload) {
      payload.action.confirmation.loading = true
      await this.wantsDestroy(payload.item)
      payload.action.confirmation.loading = false
    },
    getQueryModel () {
      const fields = this.getModuleFields(this.module)
        .filter(field => field.settings.visibility.filter)
      const out = {}
      fields.forEach((field) => {
        _.set(out, field.name, this.$route.query[field.name] || field.value || field.settings.value || undefined)
      })
      return out
    }
  }
}
</script>
