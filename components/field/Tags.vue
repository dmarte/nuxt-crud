<template>
  <c-field-autocomplete
    v-bind="$attrs"
    :response="response"
    :label="label"
    tags
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'CFieldTags',
}
</script>

<style scoped></style>
