<template>
  <v-dialog
    v-if="action.confirmation.enabled"
    ref="modal"
    max-width="350"
    eager
    persistent
    retain-focus
  >
    <template #activator="{ on, attrs }">
      <v-btn
        :key="`action_${action.label}_${type}_${index}`"
        v-bind="attrs"
        :small="dense"
        :title="action.label"
        :icon="!!!action.label || action.inline && displayMode === DISPLAY_MODE_INDEX"
        exact
        text
        type="button"
        v-on="on"
      >
        <v-icon v-if="action.icon">
          {{ action.icon }}
        </v-icon>
        <template v-if="displayMode !== DISPLAY_MODE_INDEX || !action.inline">
          {{ action.label }}
        </template>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        {{ action.confirmation.textTitle }}
      </v-card-title>
      <v-card-text v-if="action.confirmation.textBody">
        {{ action.confirmation.textBody }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :small="dense"
          :title="action.label"
          type="button"
          text
          @click.prevent="$refs.modal.save()"
        >
          {{ action.confirmation.textCancel }}
        </v-btn>
        <v-btn
          :small="dense"
          :title="action.label"
          :color="action.confirmation.color"
          :to="to"
          type="button"
          elevation="0"
          exact
          ripple
          @click.prevent="$emit('click', action)"
        >
          {{ action.confirmation.textSubmit }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-btn
    v-else
    :key="`action_${action.label}_inline_${index}`"
    :small="dense"
    :title="action.label"
    :icon="!!!action.label || action.inline && displayMode === DISPLAY_MODE_INDEX"
    :to="to"
    type="button"
    exact
    text
    @click.prevent="$emit('click', action)"
  >
    <v-icon v-if="action.icon">
      {{ action.icon }}
    </v-icon>
    <template v-if="displayMode !== DISPLAY_MODE_INDEX || !action.inline">
      {{ action.label }}
    </template>
  </v-btn>
</template>

<script>
import module from '../../mixins/module'
export default {
  name: 'CUiActionTrigger',
  mixins: [module],
  props: {
    index: {
      type: Number,
      required: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    action: {
      type: Object,
      required: true
    },
    to: {
      type: Object,
      default: null
    },
    displayMode: {
      type: String,
      required: true
    }
  },
  computed: {
    type () {
      if (this.action.standalone) {
        return 'standalone'
      }
      if (this.action.inline) {
        return 'inline'
      }

      return 'menu'
    }
  }
}
</script>
