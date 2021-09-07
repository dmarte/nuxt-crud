import { get, has, isObject } from 'lodash'
import module from './module'

export default {
  mixins: [module],
  methods: {
    /**
     * Dispatch a given action (if exists).
     *
     * @param {CrudAction.$options} action
     * @returns {void}
     */
    async dispatch(action) {
      if (!action) {
        return
      }

      if (action.vuex.action) {
        await this.$store.dispatch(action.vuxe.action)
      }

      if (action.emits) {
        this.$emit(action.emits, this.params())
      }
    },
    /**
     * Get the route must be used for a given action.
     *
     * @param {CrudAction.$options} action
     * @returns {Vue.$route}
     * */
    route(action) {
      if (!action || !action.route || !isObject(action.route)) {
        return undefined
      }
      if (!has(action.route, 'params')) {
        action.route.params = {}
      }
      action.route.params = {
        ...action.route.params,
        ...this.params(action),
        module: this.module,
      }
      if (!has(action.route, 'query')) {
        action.route.query = {}
      }

      action.route.query = {
        ...action.route.query,
        ...this.queryString(action),
      }

      return action.route
    },
    /**
     * Get the param values assigned to a given action.
     *
     * @param {CrudAction.$options} action
     * @returns {Object<String,any>}
     * */
    params(action) {
      if (!action || !action.params) {
        return {}
      }
      const out = {}
      for (const path in action.params) {
        if (!action.params.hasOwnProperty(path)) {
          continue
        }

        // Wants to add the primary key
        if (path === 'primaryKey') {
          out[this.getModulePrimaryKeyName(this.module)] =
            this.getModulePrimaryKeyValue(this.module)
          continue
        }

        const name = action.params[path]
        out[name] = get(this, path, undefined)
      }
      return out
    },
    /**
     * Get the query string values assigned to a given action.
     *
     * @param {CrudAction.$options} action
     * @returns {Object<String,any>}
     * */
    queryString(action) {
      if (!action || !action.query) {
        return {}
      }
      const out = {}
      for (const path in action.query) {
        if (!action.query.hasOwnProperty(path)) {
          continue
        }

        // Wants to add the primary key
        if (path === 'primaryKey') {
          out[this.getModulePrimaryKeyName(this.module)] =
            this.getModulePrimaryKeyValue(this.module)
          continue
        }

        const name = action.query[path]
        out[name] = get(this, path, undefined)
      }
      return out
    },
  },
}
