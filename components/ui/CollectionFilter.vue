<template>
  <v-bottom-sheet
    ref="filter"
    eager
    inset
    retain-focus
    persistent
    scrollable
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="primary"
        text
        v-bind="attrs"
        v-on="on"
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
        @click="$emit('filter-reset', {})"
      >
        {{ $t('crud.message.clean_filters') }}
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <h4>{{ $t('crud.title.filter') }}</h4>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>
            mdi-numeric
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-select
            :value="value.per_page"
            :items="perPagePreset"
            :label="$t('crud.title.per_page')"
            dense
            outlined
            flat
            persistent-placeholder
            @change="quantity => $emit('per-page', quantity)"
          />
        </v-list-item-content>
      </v-list-item>
      <template v-for="(field, index) in fields">
        <v-list-item :key="`field_${index}`">
          <v-list-item-content>
            <v-list-item-title>{{ field.label }}</v-list-item-title>
            <c-ui-field-render
              :ref="`field_${index}`"
              :value="getFieldValue(field)"
              :items="field.settings.items"
              :params="field.settings.params"
              :component="field.component"
              :display-mode="DISPLAY_MODE_FORM"
              :module="module"
              :response="response"
              @change="v => setFieldValue(field, v)"
              @keypress.enter="onFilter"
            />
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="`divider_${index}`" />
      </template>
      <v-list-item>
        <v-list-item-content>
          <v-spacer />
          <v-btn
            :loading="loading"
            type="button"
            color="primary"
            outlined
            text
            @click.prevent="onFilter"
          >
            <v-icon>
              mdi-filter
            </v-icon>
            {{ $t('crud.actions.apply') }}
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-bottom-sheet>
</template>

<script>
import module from '../../mixins/module'
import CrudResponse from '../../libs/CrudResponse'
import CUiFieldRender from './FieldRender'
export default {
  name: 'CUiCollectionFilter',
  components: { CUiFieldRender },
  mixins: [module],
  props: {
    module: {
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
        per_page: 15
      })
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      filters: {}
    }
  },
  computed: {
    hasFilters () {
      return this.fields.some(({ name }) => this.$route.query[name])
    }
  },
  methods: {
    onFilter () {
      this.$refs.filter.save()
      const out = {}
      this.fields.filter(field => field.value).forEach((field) => { out[field.name] = field.value })
      this.$emit('change', out)
    },
    getFieldValue (field) {
      if (!this.$route.query[field.name]) {
        return field.settings.value || ''
      }
      return this.$route.query[field.name]
    },
    setFieldValue (field, value) {
      field.value = value
    }
  }
}
</script>

<style scoped>

</style>
