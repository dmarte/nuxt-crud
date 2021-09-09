<template>
  <v-card flat>
    <v-toolbar flat>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <c-ui-actions-render
        :module="module"
        :dense="dense"
        :display-mode="displayMode"
        :actions="actions"
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
        prepend-inner-icon="mdi-file-find-outline"
        single-line
        solo-inverted
        flat
        clearable
        @input="(v) => $emit('search', v)"
      />
    </v-toolbar>
    <v-card-text>
      <v-card :outlined="outlined">
        <v-data-table
          :headers="headers"
          :items="value"
          :dense="dense"
          :loading="busy"
          :disable-sort="disableSort"
          :disable-filtering="disableFiltering"
          :sort-desc="querySortDesc"
          :sort-by="querySortBy"
          hide-default-footer
          must-sort
          @update:sort-desc="(v) => $emit('sort:desc', v)"
          @update:sort-by="(v) => $emit('sort:by', v)"
        >
          <template
            v-for="column in editableColumns"
            #[`item.${column.value}`]="{ item, value }"
          >
            <slot :name="`item.${column.value}`" :item="item" :value="value">
              <c-ui-field-render
                :component="column.field.component"
                :items="column.field.settings.items"
                :params="column.field.settings.params"
                :module="module"
                :display-mode="displayMode"
                :value="value"
                :response="response"
              />
            </slot>
          </template>
          <template #item._="{ item }">
            <c-ui-actions-render
              :value="item"
              :display-mode="displayMode"
              :module="module"
              :actions="actions"
            />
          </template>
        </v-data-table>
      </v-card>
    </v-card-text>
  </v-card>
</template>
<script>
import CUiActionsRender from './ActionsRender'
import CUiFieldRender from './FieldRender'

export default {
  name: 'CUiCollection',
  components: { CUiFieldRender, CUiActionsRender },
  props: {
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
    search: { type: String, default: '' },
    headers: { type: Array, default: () => [] },
    disableSort: { type: Boolean, default: false },
    disableFiltering: { type: Boolean, default: false },
    stripped: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    dense: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
    querySortDesc: { type: Boolean, default: false },
    querySortBy: { type: String, default: 'id' }
  },
  computed: {
    editableColumns () {
      return this.headers.filter(i => i.value !== '_')
    }
  }
}
</script>

<style scoped></style>
