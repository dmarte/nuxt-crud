<template>
  <v-combobox
    :value="value"
    :error-messages="response.feedback(name)"
    :label="label"
    :id="id"
    :placeholder="placeholder"
    :disabled="disabled"
    :items='items'
    :search-input.sync="search"
    item-value='value'
    item-text='text'
    v-bind="$attrs"
    v-on="$listeners"
    hide-selected
    hide-no-data
    chips
    multiple
    cache-items
    @change="whenChange"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{ $t('CrudFieldTags.NO_RESULTS', { search })}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip
        v-bind="attrs"
        :input-value="selected"
        close
        @click="select"
        @click:close="remove(item)"
      >
        {{ item }}
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
import field from '../../mixins/field'
export default {
  name: 'CFieldTags',
  mixins: [field],
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      search: null
    }
  },
  methods: {
    remove (item) {
      this.whenChange(this.value.filter(v => {
        if (typeof v === 'string') {
          return !v.toLowerCase().includes(item)
        }

        return v.text.toLowerCase().includes(item.text)
      }))
    },
  },
  i18n: {
    messages: {
      es: {
        "CrudFieldTags.NO_RESULTS" : "No se encontraron resultados para {search}. Presione <kbd>enter</kbd> para crear uno"
      }
    }
  }
}
</script>

<style scoped></style>
