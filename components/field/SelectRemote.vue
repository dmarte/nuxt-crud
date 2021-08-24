<template>
  <v-autocomplete
    :items="items"
    :value="value"
    :error-messages="response.feedback(name)"
    :label="label"
    :id="id"
    :placeholder="placeholder"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
    @change="whenChange"
  />
</template>

<script>
import _ from 'lodash'
import field from '../../mixins/field'
export default {
  name: 'CFieldSelectRemote',
  mixins: [field],
  props: {
    params: {
      type: Object,
      default() {
        return {
          origin: this.name,
          perPage: 10,
          value: 'id',
          text: 'name',
          query: {},
          wrap: null,
          getter: null,
          state: null
        }
      },
    },
  },
  async fetch() {
    let data = await this.$axios.$get(
      `${this.$crud.api.prefix}${this.params.origin}`,
      {
        params: this.getParams(),
      }
    )

    if (this.params.wrap) {
      data = _.get(data, this.params.wrap, [])
    }

    this.items = data.map((item) => ({
      value: _.get(item, this.params.value, null),
      text: _.get(item, this.params.text, null),
    }))
  },
  data() {
    return {
      items: [],
    }
  },
  methods: {
    getParams() {
      const out = {
        ...this.params.query,
        paginator: false,
        per_page: this.params.per_page,
      }
      try {
        if (this.params.getter) {
          out[this.params.getter.keyName] = this.$store.getters[this.params.getter.vuexGetterPath]
        }
        if (this.params.state) {
          out[this.params.state.keyName] = _.get(this.$store.state, this.params.state.vuexStatePath, null)
        }
      } catch(e) {}
      return out
    }
  }
}
</script>

<style scoped></style>
