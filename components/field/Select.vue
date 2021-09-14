<template>
  <v-select
    :value="value"
    :error-messages="response.feedback(name)"
    :items="options"
    :label="label"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
    @change="whenChange"
  />
</template>

<script>
import select from '../../mixins/select'

export default {
  name: 'CFieldSelect',
  mixins: [select]
}
</script>
