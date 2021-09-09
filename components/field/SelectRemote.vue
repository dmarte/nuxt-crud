<template>
  <v-autocomplete
    :id="id"
    v-bind="$attrs"
    :disabled="disabled"
    :loading="searching"
    :error-messages="response.feedback(name)"
    :hint="hint"
    :items="items"
    :label="label"
    :placeholder="placeholder"
    :search-input.sync="query"
    :value="value"
    cache-items
    hide-no-data
    hide-selected
    open-on-clear
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
      default () {
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
      }
    }
  },
  data () {
    return {
      query: null,
      searching: false,
      token: this.$axios.CancelToken.source(),
      items: []
    }
  },
  async fetch () {

  },
  watch: {
    query (value) {
      if (value) {
        this.onSearch(value)
      }
    },
    search (value) {
      this.onSearch(value)
    }
  },
  mounted () {
    if (this.value) {
      this.$fetch(this.value)
    }

    if (!this.value) {
      this.onSearch(this.value)
    }
  },
  methods: {
    exists (value) {
      return this.items.includes(i => i.name === value || i.value === value || i === value)
    },
    async onSearch (value) {
      this.searching = true
      this.token.cancel()
      this.token = this.$axios.CancelToken.source()
      try {
        let data = await this.$axios.$get(
          `${this.$crud.api.prefix}${this.params.origin}`,
          {
            cancelToken: this.token.token,
            params: {
              search: value,
              ...this
                .getParams()
            }
          }
        )
        if (this.params.wrap) {
          data = _.get(data, this.params.wrap, [])
        }

        this.items = data.map(item => ({
          value: _.get(item, this.params.value, null),
          text: _.get(item, this.params.text, null)
        }))
      } catch (exception) {
      } finally {
        this.searching = false
      }
    },
    getParams () {
      const out = {
        ...this.params.query,
        paginator: false,
        per_page: this.params.per_page
      }
      try {
        if (this.params.getter) {
          out[this.params.getter.keyName] = this.$store.getters[
            this.params.getter.vuexGetterPath
          ]
        }
        if (this.params.state) {
          out[this.params.state.keyName] = _.get(
            this.$store.state,
            this.params.state.vuexStatePath,
            null
          )
        }
      } catch (e) {}
      return out
    }
  }
}
</script>

<style scoped></style>
