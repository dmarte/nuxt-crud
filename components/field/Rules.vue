<template>
  <v-card flat>
    <v-data-table
      :headers="headers"
      :items="items"
      :show-select="!disabled"
      dense
      disable-sort
      disable-pagination
      disable-filtering
      hide-default-footer
      @item-selected="whenSelectRule"
    >
      <template #header.data-table-select />
      <template #top>
        <v-subheader class='mx-0 px-0 v-label'>{{ $t('Validation rules') }}</v-subheader>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import fields from '../../mixins/field'
import rules from '~/mixins/rules'
export default {
  name: 'CFieldRules',
  mixins: [fields, rules],
  methods: {
    whenSelectAll({ value = true, items = [] }) {
      items.forEach((item) => this.whenSelectRule({ value, item }))
    },
    whenSelectRule({ value = true, item = {} }) {
      if (!value || this.value.includes(item.id)) {
        this.whenChange(this.value.filter((rule) => rule !== item.id))
        return
      }
      this.whenChange([...this.value, item.id])
    },
  },
}
</script>

<style scoped></style>
