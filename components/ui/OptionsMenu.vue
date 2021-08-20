<template>
  <v-menu ref="menu" tile>
    <template #activator="{ on, attrs }">
      <!-- DETAIL -->
      <v-btn
        v-if="withDetail"
        :to="routeDetail"
        :disabled="processing"
        icon
      >
        <v-icon> mdi-eye-outline </v-icon>
      </v-btn>
      <v-btn
        :disabled="deleting"
        :loading="deleting"
        v-bind="attrs"
        icon
        v-on="on"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list flat dense>
      <!-- EDIT -->
      <v-dialog
        v-if="enabled('update')"
        ref="edit"
        :max-width="formWidth"
        :fullscreen="formFullscreen"
        eager
        no-click-animation
        scrollable
        persistent
      >
        <template #activator="{ on, attrs }">
          <v-list-item v-bind="attrs" v-on="on">
            <v-list-item-icon>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ $t('Edit') }}
            </v-list-item-title>
          </v-list-item>
        </template>
        <component
          :is="formName"
          :module="module"
          :params="params"
          :value="value"
          @cancel="
            () => {
              $refs.edit.save()
              $refs.menu.save()
              whenCancelled()
            }
          "
          @save:success="
            (resource) => {
              $refs.edit.save()
              $refs.menu.save()
              isUpdating ? updated(resource) : created(resource)
              saved(resource)
            }
          "
        />
      </v-dialog>
      <!-- destroy -->
      <v-dialog
        v-if="enabled('destroy')"
        ref="remove"
        max-width="300"
        persistent
      >
        <template #activator="{ on, attrs }">
          <v-list-item v-bind="attrs" v-on="on">
            <v-list-item-icon>
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              {{ $t('Delete') }}
            </v-list-item-title>
          </v-list-item>
        </template>
        <ui-delete-confirmation
          :busy="deleting"
          @cancel="
            () => {
              $refs.menu.save()
              $refs.remove.save()
              cancelled()
            }
          "
          @confirmed="
            () => {
              $refs.menu.save()
              $refs.remove.save()
              whenDestroy()
            }
          "
        />
      </v-dialog>
    </v-list>
  </v-menu>
</template>

<script>
import OgResponse from '../../libs/CrudResponse'
import forms from '../../mixins/forms'

export default {
  name: 'CUiOptionsMenu',
  mixins: [forms],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    routeDetail: {
      type: [String, Object],
      default() {
        return `${this.module}/${this.value.id}`
      },
    },
    formName: {
      type: String,
      required: true
    },
    formFullscreen: {
      type: Boolean,
      default: false,
    },
    formWidth: {
      type: Number,
      default: 500,
    },
    withDetail: {
      type: Boolean,
      default: true,
    },
    withDestroy: {
      type: Boolean,
      default: true,
    },
    withUpdate: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      response: new OgResponse(),
      deleting: false,
    }
  },
  methods: {
    enabled(action) {
      if (typeof action !== 'string') {
        return false
      }
      const name = `with${action.charAt(0).toUpperCase()}${action.substr(1)}`
      if (!this[name]) {
        return false
      }
      return this[name]
    },
  },
}
</script>

<style scoped></style>
