<template>
  <v-data-table
    :headers="headers"
    :items="value"
    class="no-table-hover"
    mobile-breakpoint="md"
    no-data-text=""
    no-results-text=""
    single-select
    show-select
    dense
    disable-pagination
    disable-sort
    disable-filtering
    hide-default-footer
    hide-default-header
    calculate-widths
  >
    <template #no-results></template>
    <template #item.data-table-select="{ index }">
      <v-btn icon @click.prevent="remove(index)">
        <v-icon> mdi-trash-can-outline </v-icon>
      </v-btn>
    </template>
    <template #top>
      <v-subheader class="px-0 py-0 v-label">{{ label }}</v-subheader>
      <v-alert v-if="response.feedback(name)" type="error" dense text>
        {{ response.feedback(name) }}
      </v-alert>
    </template>
    <template #item.value="{ value, item, index }">
      <v-text-field
        :value="value"
        :disabled="disabled"
        dense
        solo
        outlined
        flat
        @change="whenItemChange(index, { value, text: item.text })"
      />
    </template>
    <template #item.text="{ value, item, index }">
      <v-text-field
        :value="value"
        :disabled="disabled"
        dense
        solo
        outlined
        flat
        @change="whenItemChange(index, { value: item.value, text: value })"
      />
    </template>
    <template #footer>
      <v-btn color="accent" elevation="0" ripple block @click="add">
        <v-icon> mdi-plus </v-icon>
        {{ $t('Add') }}
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import field from '../../mixins/field'

export default {
  name: 'CFieldKeyValue',
  mixins: [field],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    headers() {
      return [
        {
          value: 'value',
          text: this.$tc('Value', 1),
        },
        {
          value: 'text',
          text: this.$t('attributes.label'),
        },
      ]
    },
  },
  methods: {
    whenItemChange(index, item) {
      const values = [...this.value]
      values.splice(index, 1, item)
      this.whenChange(values)
    },
    remove(index) {
      this.whenChange(this.value.filter((ob, i) => index !== i))
    },
    add() {
      this.whenChange([
        ...this.value,
        {
          value: `${this.$tc('Value', 1)} ${this.value.length}`,
          text: `${this.$t('attributes.label')} ${this.value.length}`,
        },
      ])
    },
  },
}
</script>
