<template>
  <v-dialog
    v-if="action.confirmation.enabled"
    ref="modal"
    :value="waiting"
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
        :icon="!!!action.label || action.inline && mode === 'index'"
        exact
        text
        type="button"
        v-on="on"
      >
        <v-icon v-if="action.icon">
          {{ action.icon }}
        </v-icon>
        <template v-if="mode !== 'index' || !action.inline">
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
          :disabled="action.confirmation.loading"
          type="button"
          text
          @click.prevent="$refs.modal.save(false)"
        >
          {{ action.confirmation.textCancel }}
        </v-btn>
        <v-btn
          :small="dense"
          :title="action.label"
          :color="action.confirmation.color"
          :loading="waiting || action.confirmation.loading"
          :disabled="waiting || action.confirmation.loading"
          :to="to"
          type="button"
          elevation="0"
          exact
          ripple
          @click.prevent="() => {
            $emit('click', action)
          }"
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
    :icon="!!!action.label || action.inline && mode === 'index'"
    :to="to"
    :loading="waiting"
    :disabled="waiting"
    type="button"
    exact
    text
    @click.prevent="$emit('click', action)"
  >
    <v-icon v-if="action.icon">
      {{ action.icon }}
    </v-icon>
    <template v-if="mode !== 'index' || !action.inline">
      {{ action.label }}
    </template>
  </v-btn>
</template>

<script>
export default {
  name: 'CUiActionTrigger',
  props: {
    waiting: {
      type: Boolean,
      default: false
    },
    resource: {
      type: String,
      required: true
    },
    resourceId: {
      type: [String, Number, null],
      default: undefined
    },
    parentResourceId: {
      type: [String, Number, null],
      default: undefined
    },
    parentResource: {
      type: [String, null],
      default: undefined
    },
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
    mode: {
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
  },
  watch: {
    waiting (val) {
      if (!val) { this.$refs.modal.save(false) }
    }
  }
}
</script>
