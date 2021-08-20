<template>
  <c-field-generic-read :response="response" :label="label">
      <v-chip
        v-for="item in head.display(value)"
        :key='item.value'
        color="primary"
        outlined
        pill
      >
        {{ item }}
      </v-chip>
  </c-field-generic-read>
</template>

<script>
import fields from '../../mixins/field'
export default {
  name: 'CFieldTagsDetail',
  mixins: [fields],
}
</script>

<style scoped></style>
