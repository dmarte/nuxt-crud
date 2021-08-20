<template>
  <v-card flat>
    <v-card-title>
      {{ title }}
      <v-spacer />
      <v-dialog
        ref='create'
        :fullscreen='formFullscreen'
        :max-width='formWidth'
        eager
        no-click-animation
        scrollable
        persistent
      >
        <template #activator='{ on, attrs }'>
          <v-btn
            v-bind='attrs'
            :disabled='$fetchState.pending'
            color='primary'
            elevation='0'
            ripple
            fab
            v-on='on'
          >
            <v-icon> mdi-plus</v-icon>
          </v-btn>
        </template>
        <component
          :is='formName'
          :formName='formName'
          :value='schema'
          :module='module'
          @cancel='
            () => {
              $refs.create.save()
              whenCancelled()
            }
          '
          @save:success='
            (item) => {
              $refs.create.save()
              whenCreated(item)
            }
          '
        />
      </v-dialog>
    </v-card-title>
    <v-toolbar flat>
      <v-btn-toggle>
        <v-btn
          :disabled='busy'
          icon
          @click.prevent='collect'
        >
          <v-icon> mdi-refresh</v-icon>
        </v-btn>
        <slot name='toolbar' />
      </v-btn-toggle>
      <v-spacer />
      <v-text-field
        :placeholder="$t('Quick search')"
        :value='getQuerySearch()'
        class='pt-2'
        prepend-inner-icon='mdi-file-find-outline'
        single-line
        solo-inverted
        flat
        clearable
        @input='whenSearching'
      />
    </v-toolbar>
    <v-card-text>
      <v-card :outlined='outlined'>
        <v-data-table
          :headers='columns()'
          :items='collection'
          :dense='dense'
          :loading='busy'
          :disable-sort='disableSort'
          :disable-filtering='disableFiltering'
          :sort-desc='getQuerySortDesc()'
          :sort-by='getQuerySortBy()'
          hide-default-footer
          must-sort
          @update:sort-desc='sortDesc'
          @update:sort-by='sortBy'
        >
          <template
            v-slot:[`item.${column.value}`]='{ item, value }'
            v-for='column in editableColumns'
          >
            <slot
              :name='`item.${column.value}`'
              :item='item'
              :value='value'
            >
              {{ value }}
            </slot>
          </template>
          <template #item._='{ item }'>
            <c-ui-options-menu
              v-model='item'
              :module='module'
              :params='params()'
              :form-fullscreen='formFullscreen'
              :form-name='formName'
              :form-width='formWidth'
              @update:success='whenUpdated'
              @create:success='whenCreated'
              @destroy:success='whenDestroyed'
            />
          </template>
        </v-data-table>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import pluralize from 'pluralize'
import collection from '../../mixins/collection'

export default {
  name: 'CUiCollection',
  mixins: [collection],
  props: {
    formName: {
      type: String,
      default() {
        return 'CUiForm'
      }
    },
    formFullscreen: {
      type: Boolean,
      default: false
    },
    formWidth: {
      type: Number,
      default: 500
    },
    title: {
      type: String,
      default() {
        return this.$te(`module.title.${this.module}`)
          ? this.$tc(`module.title.${this.module}`, 2)
          : this.module
      }
    },
    headers: {
      type: Array,
      default: () => []
    },
    schema: {
      type: Object,
      default: () => ({})
    },
    defaultSortBy: {
      type: String,
      default: 'id'
    },
    defaultSortDesc: {
      type: [Boolean, String],
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
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
    }
  },
  async fetch() {
    await this.collect()
  },
  computed: {
    busy() {
      return this.$fetchState.pending || this.fetching || this.processing
    },
    editableColumns() {
      return this.columns().filter((i) => i.value !== '_')
    },
  },
  methods: {
    columns() {
      return [
        ...this.headers.map((item) => {
          item.divider = this.stripped
          return item
        }),
        {
          text: '',
          value: '_',
          width: 80,
          sortable: false,
          filterable: false,
          groupable: false,
          divider: false,
          align: 'end'
        }
      ]
    }
  }
}
</script>

<style scoped></style>
