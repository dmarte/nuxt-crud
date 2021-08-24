import components from './components'
import OgResponse from '../libs/CrudResponse'

export default {
  mixins: [components],
  data() {
    return {
      collection: [],
      cancelToken: this.$axios.CancelToken.source(),
      response: new OgResponse(),
      fetching: false,
      searching: undefined,
      meta: { total: 0, lastPage: 0 }
    }
  },
  watch: {
    '$route.query': '$fetch'
  },
  beforeRouteEnter(__, _, next) {
    next((vm) => vm.initialize())
  },
  beforeRouteUpdate(__, _, next) {
    this.resetCancelToken()
    next()
  },
  methods: {
    /**
     * @returns {String}
     */
    getQuerySearch() {
      return this.$route.query?.search || ''
    },
    getQuerySortBy() {
      if (this.$route.query?.sort_by) {
        return this.$route.query?.sort_by
      }
      if (this.defaultSortBy) {
        return this.defaultSortBy
      }
      return 'id'
    },
    getQuerySortDesc() {
      if (this.$route.query?.sort_desc) {
        return String(this.$route.query?.sort_desc) === 'true'
      }

      return this.defaultSortDesc || true
    },
    getQueryPerPage() {
      return parseInt(this.$route.query?.per_page || 15)
    },
    getQueryCurrentPage() {
      return parseInt(this.$route.query?.current_page || 1)
    },
    getQueryString() {
      return {
        ...this.queryModel(),
        search: this.getQuerySearch(),
        sort_by: this.getQuerySortBy(),
        sort_desc: this.getQuerySortDesc()
      }
    },
    getQueryPagination() {
      return {
        per_page: this.getQueryPerPage(),
        page: this.getQueryCurrentPage()
      }
    },
    initialize() {},
    /**
     * Trigger when any of the filter changes.
     *
     * @param {Object} filters
     * @returns {Promise<void>}
     */
    async whenFilter(filters = {}) {
      await this.$router.push({
        name: this.$route.name,
        params: this.$route.params,
        query: {
          ...this.getQueryString(),
          ...filters
        }
      })
    },
    /**
     * Trigger used to configure the search.
     * @param {String} text
     */
    whenSearching(text = '') {
      if (this.searching) {
        clearTimeout(this.searching)
      }
      this.searching = setTimeout(
        () => this.whenFilter({ search: text, current_page: 1 }),
        500
      )
    },
    /**
     * When an action (any) is cancelled.
     * USEFUL TO BYPASS THE ACTION.
     * @param {OgResponse?} response
     * @returns {void}
     */
    whenCancelled(response) {
      this.cancelled(response)
    },
    /**
     * When an item of the collection is deleted.
     * USEFUL TO BYPASS THE ACTION.
     * @param {Object} item
     * @returns {void}
     */
    whenDestroyed(item) {
      this.destroyed(item)
    },
    /**
     * When a given element was updated.
     * USEFUL TO BYPASS THE ACTION.
     * @param {Object} item
     * @returns {void}
     */
    whenUpdated(item) {
      if (item.data) {
        item = item.data
      }
      this.updated(item)
    },
    /**
     * When a given element was created.
     * USEFUL TO BYPASS THE ACTION.
     * @param {Object} item
     * @returns {void}
     */
    whenCreated(item) {
      if (item.data) {
        item = item.data
      }
      this.created(item)
    },
    /**
     * When something wrong within the module.
     * @param {OgResponse} response
     * @returns {void}
     */
    whenFailed(response) {
      this.error(
        this.$te(response.message)
          ? this.$t(response.message)
          : response.message
      )
    },
    /**
     * The base model for the query string filters.
     * NOTE: This is to prevent override the required ones.
     * @returns {Object}
     */
    queryModel() {
      return {}
    },
    /**
     * Action to add an item when created.
     * @param {Object} item
     * @returns {void}
     */
    created(item) {
      this.collection = [this.merge(item)].concat(...this.collection)
      this.$emit('create:success', item)
      this.success(this.$t('Resource created'))
    },
    /**
     * Action to update the list when item updated.
     * @param {Object} item
     * @returns {void}
     */
    updated(item) {
      const index = this.collection.findIndex(
        (element) => element.id === item.id
      )
      if (index < 0) {
        return
      }
      this.collection.splice(index, 1, this.merge(item))
      this.$emit('update:success', item)
      this.success(this.$t('Resource updated'))
    },
    /**
     * Action to remove the item when deleted.
     * @param {Object} item
     * @returns {void}
     */
    destroyed(item) {
      this.collection = this.collection.filter(
        (element) => element?.id !== item?.id
      )
      this.$emit('destroy:success', item)
      this.success(this.$t('Resource deleted'))
    },
    /**
     * Action to take when a modal is cancelled.
     * @param {OgResponse} response
     */
    cancelled(response) {
      if (response) {
        response.reset()
      }
      this.$emit('cancel')
    },
    /**
     * Regenerate the request cancellation token.
     * @returns {void}
     */
    resetCancelToken() {
      this.cancelToken.cancel()
      this.cancelToken = this.$axios.CancelToken.source()
    },
    /**
     * Used to map every single item in a collection.
     * @param {Object} item
     * @returns {Object}
     */
    merge(item) {
      item.flags = {
        deleting: false,
        editing: false
      }
      return item
    },
    columns() {
      return []
    },
    /**
     * Indicate the relationships that should be
     * loaded.
     * @returns {*[]}
     */
    relations() {
      return []
    },
    /**
     * Additional object or params that should
     * be shared with the module store.
     * @returns {{}}
     */
    params() {
      return {}
    },
    async sortBy(column) {
      await this.whenFilter({ sort_by: column })
    },
    async sortDesc(enabled) {
      await this.whenFilter({ sort_desc: !!enabled })
    },
    async collect() {
      this.resetCancelToken()
      this.fetching = true
      try {
        const response = await this.$axios.$get(
          `/api/${this.plural(this.module)}`,
          {
            params: {
              ...this.getQueryString(),
              ...this.getQueryPagination(),
              with: this.relations(),
              paginator: true
            },
            cancelToken: this.cancelToken.token
          }
        )
        this.meta.total = response?.meta?.total || 0
        this.meta.lastPage = response?.meta?.last_page || 0
        this.collection = response.data.map(this.merge)
      } catch (exception) {
        if (this.$axios.isCancel(exception)) {
          return
        }
        this.response.parse(exception)
        this.error(this.$te(this.response.message) ? this.$t(this.response.message) : this.response.message)
        if (this.response.isSessionExpired) {
          this.$auth.logout()
          await this.$router.push({ name: 'auth-login', query: { redirect: this.$route.fullPath } })
        }
      } finally {
        this.fetching = false
      }
    },
  },
}
