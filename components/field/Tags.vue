<template>
  <v-combobox
    :value="value"
    :error-messages="response.feedback(name)"
    :label="label"
    :id="id"
    :placeholder="placeholder"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
    :search-input.sync="search"
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
  data() {
    return {
      search: null
    }
  },
  methods: {
    remove (item) {
      this.whenChange(this.value.filter(v => !v.toLowerCase().includes(item)))
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
