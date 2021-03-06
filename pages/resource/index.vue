<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card :flat="flat" :outlined="outlined">
          <v-toolbar
            dense
            flat
          >
            <v-toolbar-title>
              {{ getTranslationForResourcePlural(settings.name) }}
            </v-toolbar-title>
            <v-spacer />
            <c-ui-actions-render
              :mode="mode"
              :resource="resource"
              :resource-id="resourceId"
              :parent-resource="parentResource"
              :parent-resource-id="parentResourceId"
              :actions="getResourceActionsStandalone(settings)"
              standalone
            />
          </v-toolbar>
          <v-data-table
            :headers="headers"
            :items="collection"
            :items-per-page="meta.perPage"
            :loading="$fetchState.pending"
            :server-items-length="meta.total"
            disable-filtering
            disable-pagination
            disable-sort
            hide-default-footer
            mobile-breakpoint="md"
          >
            <template #top>
              <v-container fluid>
                <v-row>
                  <v-col>
                    <v-text-field
                      :placeholder="$t('crud.message.quick_search')"
                      :value="$route.query.search"
                      prepend-inner-icon="mdi-magnify"
                      solo-inverted
                      flat
                      dense
                      clearable
                      @input="whenSearch"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <c-ui-filters
                      ref="filters"
                      :loading="$fetchState.pending"
                      :fields="filterable"
                      :columns="headers"
                      :per-page-preset="settings.perPage"
                      :resource="resource"
                      :response="response"
                      :value="meta"
                      @reset="whenFilter"
                      @change="whenFilter"
                    />
                  </v-col>
                  <v-col class="text-right">
                    <small
                      v-if="!$fetchState.pending"
                      class="px-2 py-2"
                    >
                      {{
                        $tc(`crud.title.pagination`, meta.total, {
                          from: meta.from,
                          to: meta.to,
                          total: meta.total
                        })
                      }}
                    </small>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider />
            </template>
            <template
              v-for="(column, index) in headers.filter(
                field => field.value !== '_'
              )"
              #[`item.${column.value}`]="props"
            >
              <c-ui-render-field
                :key="`field_${index}`"
                :index="index"
                :loading="$fetchState.pending"
                :mode="mode"
                :response="response"
                :context='model'
                :value="parseCollectionField(column.field, props.value)"
              />
            </template>
            <template #item._="props">
              <c-ui-actions-render
                v-model="props.item"
                :mode="mode"
                :resource="resource"
                :resource-id="parsePrimaryValue(props.item)"
                :parent-resource="$route.params.parentResource"
                :parent-resource-id="$route.params.parentResourceId"
                :actions="getResourceActionsInline(settings)"
                @destroy="whenDestroy"
              />
            </template>
            <template #footer>
              <div v-if="meta.lastPage > 1" class="pb-4">
                <v-divider class="mb-3" />
                <v-pagination
                  :disabled="$fetchState.pending"
                  :value="meta.currentPage"
                  :length="meta.lastPage"
                  :total-visible="8"
                  circle
                  @input="whenPaginate"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { cloneDeep, set, has, get } from 'lodash'
import child from '../../mixins/resource/child'
import CUiRenderField from '../../components/ui/CUiRenderField'
import CUiFilters from '../../components/ui/CUiFilters'
import CUiActionsRender from '../../components/ui/CUiActionRender'

export default {
  name: 'CrudPageResourceIndex',
  components: {
    CUiActionsRender,
    CUiFilters,
    CUiRenderField
  },
  mixins: [child],
  props: {
    flat: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: false
    },
    query: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      searching: null,
      collection: [],
      meta: {}
    }
  },
  async fetch () {
    try {
      const {
        collection,
        meta
      } = await this.paginate(
        this.params(),
        this.settings
      )
      this.collection = collection
      this.meta = meta
    } catch (e) {
      this.$store.dispatch(this.settings.hooks.onIndexError, { exception: e, resource: this.settings })
    }
  },
  computed: {
    headers () {
      return this.getResourceHeaders(this.settings)
    }
  },
  watch: {
    $route: '$fetch'
  },
  mounted () {
    if (!this.$refs.filters.hasFilters) {
      this.$refs.filters.onFilter(
        this.getPerPage(this.settings),
        this.getSortBy(this.settings),
        this.getSortByDesc(this.settings),
        true
      )
    }
  },
  methods: {
    async whenFilter (query = {}) {
      await this.$router.push({
        name: this.$route.name,
        params: this.$route.params,
        query
      })
    },
    whenSearch (search) {
      if (this.searching) {
        clearTimeout(this.searching)
      }

      this.searching = setTimeout(async () => {
        await this.whenFilter({ currentPage: 1, search })
      }, 300)
    },
    async whenPaginate (page) {
      await this.whenFilter({ ...this.$route.query, currentPage: page })
    },
    parsePrimaryValue (item) {
      return get(item, this.getPrimaryKeyName())
    },
    parseCollectionField (field, defaultValue) {
      const out = cloneDeep(field)
      out.value = defaultValue
      return out
    },
    params () {
      const query = {
        resource: this.resource,
        parentResource: this.parentResource,
        parentResourceId: this.parentResourceId,
        prefix: this.$crud.api.prefix,
        query: this.$route.query,
        currentPage: this.getCurrentPage(this.settings),
        perPage: this.getPerPage(this.settings),
        sortBy: this.getSortBy(this.settings),
        sortDesc: this.getSortByDesc(this.settings),
        search: this.$route.query.search
      }
      query.query.currentPage = undefined
      query.query.perPage = undefined
      query.query.sortBy = undefined
      query.query.sortDesc = undefined
      query.query.search = undefined

      this.filterable
        .forEach((field) => {
          if (has(query.query, field.name)) {
            return
          }
          set(query.query, field.name, field.value || field.defaultValue)
        })
      query.query = { ...query.query, ...this.query }
      return query
    }
  }
}
</script>

<style scoped></style>
