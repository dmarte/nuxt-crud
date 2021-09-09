import _ from 'lodash'
import CrudResponse from '../libs/CrudResponse'
import module from './module'
import translator from './translator'
export default {
  mixins: [module, translator],
  props: {
    module: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      collection: [],
      formOpened: false,
      model: {},
      cancelToken: this.$axios.CancelToken.source(),
      response: new CrudResponse(),
      fetching: false,
      searching: undefined,
      meta: { total: 0, lastPage: 0 }
    }
  },
  watch: {
    '$route.query': '$fetch'
  },
  beforeRouteEnter (__, _, next) {
    next(vm => vm.initialize())
  },
  beforeRouteUpdate (__, _, next) {
    this.resetCancelToken()
    next()
  },
  methods: {
    /**
     * @returns {String}
     */
    getQuerySearch () {
      return this.$route.query.search || null
    },
    /**
     * @returns {string}
     */
    getQuerySortBy () {
      if (this.$route.query.sort_by) {
        return this.$route.query.sort_by
      }
      if (this.defaultSortBy) {
        return this.defaultSortBy
      }
      return this.getModulePrimaryKeyName(this.module)
    },
    /**
     * @returns {boolean}
     */
    getQuerySortDesc () {
      if (this.$route.query.sort_desc) {
        return String(this.$route.query.sort_desc) === 'true'
      }

      return this.defaultSortDesc || true
    },
    /**
     * @returns {number}
     */
    getQueryPerPage () {
      return parseInt(
        this.$route.query.per_page ||
          this.getModuleSettings(this.module).perPage ||
          15
      )
    },
    /**
     * @returns {number}
     */
    getQueryCurrentPage () {
      return parseInt(this.$route.query.current_page || 1)
    },
    /**
     * Get the current query string in the route.
     * @returns {Object}
     */
    getQueryString () {
      return {
        ...this.getQueryModel(),
        search: this.getQuerySearch(),
        sort_by: this.getQuerySortBy(),
        sort_desc: this.getQuerySortDesc()
      }
    },
    /**
     * Get the keys-value for pagination state.
     *
     * @returns {{per_page: number, page: number}}
     */
    getQueryPagination () {
      return {
        per_page: this.getQueryPerPage(),
        page: this.getQueryCurrentPage()
      }
    },
    /**
     * A method that should be used to initialize the page.
     *
     * @returns {void}
     */
    initialize () {},
    /**
     * The base model for the query string filters.
     * NOTE: This is to prevent override the required ones.
     * @returns {Object}
     */
    getQueryModel () {
      return {}
    },
    /**
     * Trigger when any of the filter changes.
     *
     * @param {Object} filters
     * @returns {Promise<void>}
     */
    async whenFilter (filters = {}) {
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
     * @returns {void}
     */
    whenSearching (text = '') {
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
     * @param {CrudResponse?} response
     * @returns {void}
     */
    whenCancelled (response) {
      this.cancelled(response)
    },
    /**
     * When an item of the collection is deleted.
     * USEFUL TO BYPASS THE ACTION.
     * @param {Object} item
     * @returns {void}
     */
    whenDestroyed (item) {
      this.collection = this.collection.filter(
        element => element.id !== item.id
      )
      this.destroyed(item)
    },
    /**
     * When a given element was updated.
     * USEFUL TO BYPASS THE ACTION.
     *
     * @param {Object} item
     * @returns {void}
     */
    whenUpdated (item) {
      if (item.data) {
        item = item.data
      }
      const index = this.collection.findIndex(
        element => element.id === item.id
      )
      if (index < 0) {
        return
      }
      this.collection.splice(index, 1, this.merge(item))
      this.updated(item)
    },
    /**
     * When a given element was created.
     * USEFUL TO BYPASS THE ACTION.
     * @param {Object} item
     * @returns {void}
     */
    whenCreated (item) {
      if (item.data) {
        item = item.data
      }
      this.collection = [this.merge(item)].concat(...this.collection)
      this.created(item)
    },
    /**
     * When something wrong within the module.
     * @param {CrudResponse} response
     * @returns {void}
     */
    whenFailed (response) {
      this.failed(response)
    },
    /**
     * Set a given item in the "model" base property.
     * @param {object} item
     * @returns {void}
     */
    select (item) {
      this.model = _.cloneDeep(item)
    },
    /**
     * Trigger the form in update mode.
     *
     * @param {any} item
     * @returns {void}
     */
    wantsUpdate (item) {
      this.select(item)
      this.formOpened = true
    },
    /**
     * Push to detail page.
     *
     * @param {Object}item
     * @returns {void}
     */
    wantsDetail (item) {
      this.select(item)
      this.$router.push(this.getModuleRouteDetail(this.module))
    },
    /**
     * Regenerate the request cancellation token.
     * @returns {void}
     */
    resetCancelToken () {
      this.cancelToken.cancel()
      this.cancelToken = this.$axios.CancelToken.source()
    },
    /**
     * Used to map every single item in a collection.
     * IMPORTANT:
     * If you override this method make sure to return the item modified.
     *
     * @param {Object} item
     * @returns {Object}
     */
    merge (item) {
      item.flags = {
        deleting: false,
        editing: false
      }
      return item
    },
    /**
     * Generate all the columns that should be used in the collection.
     * @returns {Array}
     */
    columns () {
      return [
        ...this.getModuleFieldsUsedInIndex(this.module).map((item) => {
          item.divider = !!this.stripped
          return item
        }),
        {
          text: '',
          value: '_',
          sortable: false,
          filterable: false,
          groupable: false,
          divider: false,
          align: 'end',
          cellClass: 'text-right'
        }
      ]
    },
    /**
     * Indicate the relationships that should be loaded.
     * @returns {Array}
     */
    relations () {
      return []
    },
    /**
     * Additional params that should be shared with the module store.
     * @returns {Object}
     */
    params () {
      return {}
    },
    /**
     * Sort the results by a given column.
     *
     * @param {String} column
     * @returns {Promise<void>}
     */
    async sortBy (column) {
      return await this.whenFilter({ sort_by: column })
    },
    /**
     * Sort the collection in descending order.
     *
     * @param {boolean} enabled
     * @returns {Promise<void>}
     */
    async sortDesc (enabled) {
      return await this.whenFilter({ sort_desc: !!enabled })
    },
    /**
     * Responsible to collect the information related to the given module.
     *
     * @returns {Promise<void>}
     */
    async collect () {
      this.resetCancelToken()
      this.fetching = true
      try {
        const response = await this.$axios.$get(
          this.getModuleApiUrl(this.module),
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
        this.meta.total = response.meta.total || 0
        this.meta.lastPage = response.meta.last_page || 0
        this.collection = response.data.map(this.merge)
      } catch (exception) {
        if (this.$axios.isCancel(exception)) {
          return
        }
        this.response.parse(exception)
        this.whenFailed(this.response)
      } finally {
        this.fetching = false
      }
    }
  }
}
