<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar flat dense>
            <v-toolbar-title>
              {{ getTranslationForResourcePlural(settings.name) }}
            </v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
              <template v-for='action in getResourceActionsStandalone(settings)'>
                <v-btn :to='action.route' text @click='dispatchResourceAction(action)'>
                  <v-icon v-if='action.icon'>
                    {{ action.icon }}
                  </v-icon>
                  {{ action.label }}
                </v-btn>
              </template>
            </v-toolbar-items>
          </v-toolbar>
          <v-data-table
            :headers='getResourceHeaders(settings)'
            :items='collection'
            :items-per-page='meta.perPage'
            :loading='$fetchState.pending'
            :server-items-length='meta.total'
            mobile-breakpoint='md'
            disable-filtering
            disable-sort
            disable-pagination
            hide-default-footer
          >
            <template #top>
              <v-divider />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import resource from '../../mixins/resource/resource'

export default {
  name: 'CrudPageResourceIndex',
  mixins: [resource],
  async fetch() {
    const { collection, meta } = await this.paginate(this.params(), this.settings)
    this.collection = collection
    this.meta = meta
  },
  data() {
    return {
      collection: [],
      meta: {}
    }
  },
  methods: {
    params() {
      const query = {
        resource: this.resource,
        parentResource: this.parentResource,
        parentResourceId: this.parentResourceId,
        prefix: this.$crud.api.prefix
      }
      query[this.settings.keyPerPage] = this.getPerPage(this.settings)
      query[this.settings.keySortBy] = this.getSortBy(this.settings)
      query[this.settings.keySortByDesc] = this.getSortByDesc(this.settings)
      query[this.settings.keyCurrentPage] = this.getCurrentPage(this.settings)
      return query
    }
  }
}
</script>

<style scoped>

</style>
