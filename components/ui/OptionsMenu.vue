<template>
  <v-menu ref="menu" tile rounded>
    <template #activator="{ on, attrs }">
      <!-- DETAIL -->
      <v-btn
        v-if="enabled('detail')"
        icon
        @click.prevent='whenDetail'
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
    <v-list min-width='200' dense>
      <v-list-item v-if="enabled('update')" @click.prevent="whenUpdate">
        <v-list-item-icon>
          <v-icon>mdi-pencil</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('Edit') }}
        </v-list-item-title>
      </v-list-item>
      <v-divider v-if='enabled("destroy")' />
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
        <c-ui-delete-confirmation
          :busy="deleting"
          @cancel="
            () => {
              $refs.menu.save()
              $refs.remove.save()
              whenCancel()
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
import CUiDeleteConfirmation from './DeleteConfirmation'
export default {
  name: 'CUiOptionsMenu',
  components: { CUiDeleteConfirmation },
  props: {
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
      deleting: false,
    }
  },
  methods: {
    whenCancel() {
      this.$emit('cancel', {})
    },
    whenDestroy() {
      this.$emit('destroy', {})
    },
    whenUpdate() {
      this.$emit('update', {})
    },
    whenDetail() {
      this.$emit('detail', {})
    },
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
