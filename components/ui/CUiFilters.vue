<template>
  <div>
    <v-btn
      :disabled="loading"
      type="button"
      color="primary"
      text
      @click.stop="opened = true"
    >
      <v-icon>
        mdi-filter-menu-outline
      </v-icon>
      {{ $t('crud.title.filter') }}
    </v-btn>
    <v-btn
      v-if="hasFilters"
      color="warning"
      type="button"
      elevation="0"
      small
      @click="onReset"
    >
      {{ $t('crud.message.clean_filters') }}
    </v-btn>
    <v-navigation-drawer
      ref="filter"
      v-model="opened"
      fixed
      temporary
      disable-route-watcher
    >
      <v-list dense>
        <v-list-item>
          <v-list-item-title>
            <h4>
              {{ $t('crud.title.filter') }}
            </h4>
          </v-list-item-title>
          <v-list-item-icon>
            <v-btn small icon @click.prevent="opened = false">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item dense>
          <v-select
            :value="value.perPage"
            :items="perPagePreset"
            :label="$t('crud.title.per_page')"
            prepend-icon="mdi-numeric"
            class="py-0 my-0"
            dense
            outlined
            flat
            persistent-placeholder
            @change="onPerPage"
          />
        </v-list-item>
        <v-list-item>
          <v-select
            :value="value.sortBy"
            :items="columns.filter(({component}) => !['CFieldHead','CFieldTab'].includes(component))"
            :label="$t('crud.title.sort_by')"
            class="py-0 my-0"
            prepend-icon="mdi-sort"
            dense
            outlined
            flat
            persistent-placeholder
            @change="onSortBy"
          />
        </v-list-item>
        <v-list-item>
          <v-select
            :value="value.sortDesc"
            :items="orders"
            :label="$t('crud.title.sort_by_desc')"
            class="py-0 my-0"
            prepend-icon="mdi-sort-alphabetical-variant"
            dense
            outlined
            flat
            persistent-placeholder
            @change="onSortDesc"
          />
        </v-list-item>
        <v-subheader class="my-0 py-0">
          {{ $t('crud.message.search_conditions') }}
        </v-subheader>
        <template v-for="(field, index) in filterable">
          <v-list-item :key="`item_${index}`">
            <v-list-item-content>
              <c-ui-field-render
                :key="`field_${index}`"
                :ref="`field_${index}`"
                mode="filter"
                :index="index"
                :value="field"
                :response="response"
                dense
                @input="f => onChange(f, index)"
                @keypress.enter="onFilter(value.perPage, value.sortBy, value.sortDesc)"
              />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <template #append>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-btn
                :loading="loading"
                type="button"
                color="primary"
                class="my-3"
                block
                @click.prevent="() => {
                  opened = false
                }"
              >
                <v-icon>
                  mdi-filter
                </v-icon>
                {{ $t('crud.actions.apply') }}
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { set, cloneDeep, isEmpty, isBoolean } from 'lodash'
import CrudResponse from '../../libs/CrudResponse'
import CUiFieldRender from './CUiRenderField'

export default {
  name: 'CUiFilters',
  components: { CUiFieldRender },
  props: {
    resource: {
      type: String,
      required: true
    },
    response: {
      type: CrudResponse,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    perPagePreset: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({
        sortBy: 'id',
        sortDesc: false,
        perPage: 15
      })
    },
    columns: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      opened: false,
      filters: {},
      filterable: []
    }
  },
  computed: {
    hasFilters () {
      return this.filterable.filter(({ is }) => is !== 'CFieldHidden').some(({ name }) => this.$route.query[name])
    },
    sortable () {
      return this.fields.filter(({ is, sortable }) => sortable && !['CFieldTab'].includes(is)).map(({ name, label }) => ({ value: name, text: label }))
    },
    orders () {
      return [
        { text: this.$t('crud.message.asc'), value: false },
        { text: this.$t('crud.message.desc'), value: true }
      ]
    }
  },
  watch: {
    fields () {
      this.process()
    }
  },
  mounted () {
    this.process()
  },
  methods: {
    onPerPage (quantity) {
      this.onFilter(quantity, this.value.sortBy, this.value.sortDesc)
    },
    onSortBy (column) {
      this.onFilter(this.value.perPage, column, this.value.sortDesc)
    },
    onSortDesc (desc) {
      this.onFilter(this.value.perPage, this.value.sortBy, desc)
    },
    process () {
      this.filterable = this
        .fields
        .filter(({ filter, visibility }) => filter || visibility.filter)
        .map(cloneDeep)
    },
    onFilter (perPage = 15, sortBy = 'id', sortDesc = true) {
      const out = { perPage, sortBy, sortDesc }
      this.filterable.forEach((field) => {
        if (isEmpty(field.value) && (!isEmpty(field.defaultValue) || isBoolean(field.defaultValue))) {
          field.value = field.defaultValue
        }

        if (isEmpty(field.value) && !isBoolean(field.value)) {
          return
        }

        if (isBoolean(field.value)) {
          set(out, field.name, field.value.toString())
          return
        }
        set(out, field.name, field.value)
      })
      this.$emit('change', out)
    },
    onReset () {
      this.process()
      this.onFilter(this.value.perPage, this.value.sortBy, this.value.sortDesc, true)
    },
    onChange (field, index) {
      this.filterable.splice(index, 1, field)
      this.onFilter(this.value.perPage, this.value.sortBy, this.value.sortDesc)
    }
  }
}
</script>

<style scoped>
</style>
