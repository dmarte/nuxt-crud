<template>
  <v-card flat>
    <v-toolbar flat>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <c-ui-actions-render
        :actions="actions"
        :dense="dense"
        :display-mode="displayMode"
        :module="module"
        standalone
      />
    </v-toolbar>
    <v-toolbar flat>
      <v-btn-toggle>
        <v-btn
          :disabled="busy"
          icon
          @click.prevent="() => $emit('refresh', true)"
        >
          <v-icon> mdi-refresh</v-icon>
        </v-btn>
        <slot name="toolbar" />
      </v-btn-toggle>
      <v-spacer />
      <v-text-field
        :placeholder="$t('crud.message.quick_search')"
        :value="search"
        class="pt-2"
        clearable
        flat
        prepend-inner-icon="mdi-file-find-outline"
        single-line
        solo-inverted
        @input="v => $emit('search', v)"
      />
    </v-toolbar>
    <v-card-text>
      <v-card :outlined="outlined">
        <v-data-table
          :dense="dense"
          :disable-filtering="disableFiltering"
          :disable-sort="disableSort"
          :headers="headers"
          :items="value"
          :loading="busy"
          :sort-by="querySortBy"
          :sort-desc="querySortDesc"
          mobile-breakpoint="md"
          disable-pagination
          calculate-widths
          hide-default-footer
          must-sort
          @update:sort-desc="v => $emit('sort:desc', v)"
          @update:sort-by="v => $emit('sort:by', v)"
        >
          <template
            v-for="column in editableColumns"
            #[`item.${column.value}`]="props"
          >
            <slot
              :item="props.item"
              :name="`item.${column.value}`"
              :value="props.value"
            >
              <c-ui-field-render
                :component="column.field.component"
                :display-mode="displayMode"
                :items="column.field.settings.items"
                :module="module"
                :params="column.field.settings.params"
                :response="response"
                :value="props.value"
              />
            </slot>
          </template>
          <template #item._="{ item }">
            <c-ui-actions-render
              :actions="actions"
              :dense="dense"
              :display-mode="displayMode"
              :module="module"
              :value="item"
              @destroy="$emit('destroy', item)"
            />
          </template>
          <template #top>
            <v-row>
              <v-col>
                <c-ui-collection-filter
                  :module="module"
                  :display-mode="displayMode"
                  :response="response"
                  :fields="filters"
                  :loading="busy"
                  :per-page-preset="perPagePreset"
                  :value="{ per_page: paginatorPerPage }"
                  @per-page="(page) => $emit('per-page',page)"
                  @change="(v) => $emit('filter', v)"
                />
              </v-col>
              <v-col class="text-right">
                <small
                  v-if="!busy"
                  class="px-2 py-2"
                >
                  {{
                    $tc(`crud.title.pagination`, paginatorTotal > 1 ? 2 : 1, {
                      from: paginatorFrom,
                      to: paginatorTo,
                      total: paginatorTotal
                    })
                  }}
                </small>
              </v-col>
            </v-row>
            <v-divider />
          </template>
          <template #footer>
            <v-divider />
            <v-row>
              <v-col class="text-left">
                <v-pagination
                  v-if="paginatorLastPage > 1"
                  :disabled="busy"
                  :length="paginatorLastPage"
                  :total-visible="8"
                  :value="paginatorCurrentPage"
                  @input="onPaginate"
                />
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-card>
    </v-card-text>
  </v-card>
</template>
<script>
import CUiActionsRender from './ActionsRender'
import CUiFieldRender from './FieldRender'
import CUiCollectionFilter from './CollectionFilter'

export default {
  name: 'CUiCollection',
  components: {
    CUiCollectionFilter,
    CUiFieldRender,
    CUiActionsRender
  },
  props: {
    perPagePreset: {
      type: Array,
      default: () => [10, 30, 50]
    },
    paginatorPerPage: {
      type: [String, Number],
      required: true
    },
    paginatorCurrentPage: {
      type: [String, Number],
      required: true
    },
    paginatorTotal: {
      type: [String, Number],
      required: true
    },
    paginatorFrom: {
      type: [String, Number],
      required: true
    },
    paginatorTo: {
      type: [String, Number],
      required: true
    },
    paginatorLastPage: {
      type: [String, Number],
      required: true
    },
    filters: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      required: true
    },
    response: {
      type: Object,
      required: true
    },
    displayMode: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    },
    actions: {
      type: Array,
      default: () => []
    },
    search: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      default: () => []
    },
    disableSort: {
      type: Boolean,
      default: false
    },
    disableFiltering: {
      type: Boolean,
      default: false
    },
    stripped: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    busy: {
      type: Boolean,
      default: false
    },
    querySortDesc: {
      type: Boolean,
      default: false
    },
    querySortBy: {
      type: String,
      default: 'id'
    }
  },
  computed: {
    editableColumns () {
      return this.headers.filter(i => i.value !== '_')
    }
  },
  methods: {
    onPaginate (page) {
      this.$emit('paginate', page)
      this.$vuetify.goTo(0)
    }
  }
}
</script>
