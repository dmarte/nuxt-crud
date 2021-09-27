import _ from 'lodash'

export default {
  props: {
    placeholder: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
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
  async fetch () {
    await this.onSearch(this.value)
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
  data () {
    return {
      query: null,
      searching: false,
      token: this.$axios.CancelToken.source(),
      options: []
    }
  },
  computed: {
    currentText () {
      const item = this.options.find(item => item.value === this.value)
      if (!item) {
        return this.value
      }
      return item.text
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
        this.options = data.map(item => ({
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
