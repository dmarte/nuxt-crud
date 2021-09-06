<template>
  <v-menu>
    <template #activator="{ on, attrs }">
      <v-btn
        v-if="collectionNotInline.length > 0"
        type="button"
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon> mdi-dots-vertical </v-icon>
      </v-btn>
      <template v-for="(action, index) in collectionStandalone">
        <v-btn
          :key="`action_${action.label}_inline_${index}`"
          :small="dense"
          :title="action.label"
          :icon="!!!action.label"
          :to="route(action)"
          exact
          text
          type="button"
          @click.prevent="dispatch(action)"
        >
          <v-icon v-if="action.icon">
            {{ action.icon }}
          </v-icon>
          {{ action.label }}
        </v-btn>
      </template>
      <template v-for="(action, index) in collectionInline">
        <v-btn
          :key="`action_${action.label}_inline_${index}`"
          :small="dense"
          :title="action.label"
          :icon="!!!action.label"
          :to="route(action)"
          exact
          text
          type="button"
          @click.prevent="dispatch(action)"
        >
          <v-icon v-if="action.icon">
            {{ action.icon }}
          </v-icon>
          {{ action.label }}
        </v-btn>
      </template>
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
</template>
<script>
import module from '../../mixins/module'
import { get, isObject, has } from 'lodash'
export default {
  name: 'CUiActionsRender',
  mixins: [module],
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    module: {
      type: String,
      required: true,
    },
    displayMode: {
      type: String,
      required: true,
    },
    standalone: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array,
      default: () => [],
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    collection() {
      return this.actions.filter(({ visibility, standalone }) => {
        const visible = visibility[this.displayMode.toLowerCase()]
        if (this.standalone) {
          return visible && standalone
        }

        return visible && !standalone
      })
    },
    collectionStandalone() {
      return this.collection.filter(({standalone}) => standalone)
    },
    collectionInline() {
      return this.collection.filter(({ inline, standalone }) => inline && !standalone)
    },
    collectionNotInline() {
      return this.collection.filter(({ inline, standalone }) => !inline && !standalone)
    },
    primaryKey() {
      return this.getModulePrimaryKeyValue(this.module)
    },
  },
  methods: {
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
    /**
     * Dispatch a given action (if exists).
     *
     * @param {CrudAction.$options} action
     * @returns {void}
     */
    async dispatch(action) {
      if (!action || !action.vuex.action) {
        return
      }
      await this.$store.dispatch(action.vuxe.action)
    },
  },
}
</script>
