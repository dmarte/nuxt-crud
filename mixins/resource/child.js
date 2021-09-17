import resource from './resource'
export default {
  mixins:[resource],
  props: {
    parentResource: {
      type: String,
      default() {
        return this.$route.params.parent
      }
    },
    parentResourceId: {
      type: String,
      default() {
        return this.$route.params.parent_id
      }
    },
  }
}
