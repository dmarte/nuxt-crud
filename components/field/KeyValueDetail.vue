<template>
  <c-field-generic-read :response='response' :label="label">
    <v-card v-if='value.length > 0' outlined>
      <v-data-table
        :headers="headers"
        :items="value"
        mobile-breakpoint="md"
        no-data-text=""
        no-results-text=""
        dense
        disable-pagination
        disable-sort
        disable-filtering
        hide-default-footer
        calculate-widths
      >
        <template #no-results></template>
      </v-data-table>
    </v-card>
  </c-field-generic-read>
</template>

<script>
import fields from '../../mixins/field'
export default {
  name: 'CFieldKeyValueRead',
  mixins: [fields],
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
}
</script>

<style scoped></style>
