<template>
  <v-list-item :key="`item_${value}`">
    <v-list-item-subtitle>
      {{ label }}
    </v-list-item-subtitle>
    <v-list-item-title>
      <slot>
        {{ getValueText(item) }}
      </slot>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import _ from 'lodash'
import field from '../../mixins/field'
export default {
  name: 'CFieldSelectRemoteDetail',
  mixins: [field],
  data () {
    return {
      fetching: false,
      item: {}
    }
  },
  mounted () {
    if (this.value) {
      this.fetch()
    }
  },
  methods: {
    getValueText (item) {
      return _.get(item, this.params.text)
    },
    getValue (item) {
      return _.get(item, this.params.value)
    },
    async fetch () {
      this.fetching = true
      try {
        this.item = await this.$axios.$get(`${this.params.origin}/${this.value}`, {
          params: this.params.query
        })
      } catch (exception) {
        this.response.parse(exception)
      } finally {
        this.fetching = false
      }
    }
  }
}
</script>

<style scoped>

</style>
