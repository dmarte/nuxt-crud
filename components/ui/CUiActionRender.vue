<template>
  <div v-if="actions.length > 0">
    <template v-for="(action, index) in collectionStandalone">
      <c-ui-action-trigger
        :key="`action_standalone_${index}`"
        :waiting="processing"
        :dense="dense"
        :action="action"
        :index="index"
        :to="route(action)"
        :mode="mode"
        :resource="resource"
        :resource-id="resourceId"
        :parent-resource="parentResource"
        :parent-resource-id="parentResourceId"
        @click="dispatch"
      />
    </template>
    <template v-for="(action, index) in collectionInline">
      <c-ui-action-trigger
        :key="`action_inline_${index}`"
        :waiting="processing"
        :dense="dense"
        :action="action"
        :index="index"
        :to="route(action)"
        :mode="mode"
        :resource="resource"
        :resource-id="resourceId"
        :parent-resource="parentResource"
        :parent-resource-id="parentResourceId"
        @click="dispatch"
      />
    </template>
    <v-menu v-if="collectionNotInline.length > 0">
      <template #activator="{ on, attrs }">
        <v-btn
          type="button"
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon> mdi-dots-vertical </v-icon>
        </v-btn>
      </template>
      <v-list v-if="collectionNotInline.length > 0" :dense="dense">
        <v-list-item
          v-for="(action, index) in collectionNotInline"
          :key="`action_${action.name}_${index}`"
          :to="route(action)"
          @click.prevent="dispatch(action)"
        >
          <v-list-item-icon>
            <v-icon v-if="action.icon">
              {{ action.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ action.label }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
import { get, isObject, has } from 'lodash'
import CUiActionTrigger from './CUiActionTrigger'
export default {
  name: 'CUiActionsRender',
  components: { CUiActionTrigger },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    resource: {
      type: String,
      required: true
    },
    resourceId: {
      type: [String, Number, null],
      default: () => undefined
    },
    parentResourceId: {
      type: [String, Number, null],
      default: undefined
    },
    parentResource: {
      type: [String, null],
      default: undefined
    },
    mode: {
      type: String,
      required: true
    },
    standalone: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Array,
      default: () => []
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return { processing: false }
  },
  computed: {
    collection () {
      return this.actions.filter(({ visibility, standalone }) => {
        const visible = visibility[this.mode.toLowerCase()]
        if (this.standalone) {
          return visible && standalone
        }
        return visible && !standalone
      })
    },
    collectionStandalone () {
      return this.actions.filter(({ standalone, visibility, inline }) => !inline && visibility[this.mode] && standalone)
    },
    collectionInline () {
      return this.collection.filter(
        ({ inline, standalone }) => inline && !standalone
      )
    },
    collectionNotInline () {
      return this.collection.filter(
        ({ inline, standalone }) => !inline && !standalone
      )
    },
    primaryKey () {
      return this.getModulePrimaryKeyValue(this.resource)
    }
  },
  methods: {
    /**
     * Get the route must be used for a given action.
     *
     * @param {CrudAction.$options} action
     * @returns {Vue.$route}
     * */
    route (action) {
      if (!action || !action.route || !isObject(action.route)) {
        return undefined
      }
      if (!has(action.route, 'params')) {
        action.route.params = {}
      }
      action.route.params = {
        ...action.route.params,
        ...this.params(action),
        module: this.resource
      }
      if (!has(action.route, 'query')) {
        action.route.query = {}
      }
      action.route.query = {
        ...action.route.query,
        ...this.queryString(action)
      }
      return action.route
    },
    /**
     * Get the param values assigned to a given action.
     *
     * @param {CrudAction.$options} action
     * @returns {Object<String,any>}
     * */
    params (action) {
      if (!action || !action.params) {
        return {}
      }
      const out = {}
      for (const path in action.params) {
        // eslint-disable-next-line no-prototype-builtins
        if (!action.params.hasOwnProperty(path)) {
          continue
        }
        // Wants to add the primary key
        if (path === 'primaryKey') {
          out[this.getModulePrimaryKeyName(this.resource)] = this.getModulePrimaryKeyValue(this.resource)
          continue
        }
        out[path] = get(this, path, action.params[path])
      }
      return out
    },
    /**
     * Get the query string values assigned to a given action.
     *
     * @param {CrudAction.$options} action
     * @returns {Object<String,any>}
     * */
    queryString (action) {
      if (!action || !action.query) {
        return {}
      }
      const out = {}
      for (const path in action.query) {
        // Wants to add the primary key
        if (path === 'primaryKey') {
          out[this.getModulePrimaryKeyName(this.resource)] =
            this.getModulePrimaryKeyValue(this.resource)
          continue
        }
        // When component path
        const name = action.query[path]
        out[name] = get(this, path, undefined)
      }
      return out
    },
    /**
     * Dispatch a given action (if exists).
     *
     * @param {CrudAction.$options} action
     * @returns {void}
     */
    async dispatch (action) {
      if (!action) {
        return
      }
      try {
        const payload = {
          action,
          value: this.value,
          params: this.params(action)
        }
        if (action.vuex.action) {
          await this.$store.dispatch(action.vuex.action, payload)
        }
        this.$emit(action.name, payload)
      } catch (exception) {} finally {
        this.processing = false
      }
    }
  }
}
</script>
