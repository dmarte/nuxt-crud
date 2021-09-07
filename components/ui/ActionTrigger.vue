<template>
  <v-dialog v-if="action.confirmation.enabled">
    <template #activator="{ on, attrs }">
      <v-btn
        :key="`action_${action.label}_${type}_${index}`"
        :small="dense"
        :title="action.label"
        :icon="!!!action.label"
        exact
        text
        type="button"
        v-on="on"
        v-bin="attrs"
      >
        <v-icon v-if="action.icon">
          {{ action.icon }}
        </v-icon>
        {{ action.label }}
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
        <v-btn type="button">
          {{ action.confirmation.textCancel }}
        </v-btn>
        <v-btn
          :small="dense"
          :title="action.label"
          :icon="!!!action.label"
          type="button"
          exact
          text
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

<script>
import action from '../../mixins/action'
export default {
  name: 'CUiActionTrigger',
  mixins: [action],
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
    }
  },
  computed: {
    type() {
      if(this.action.standalone) {
        return 'standalone'
      }
      if (this.action.inline) {
        return 'inline'
      }

      return 'menu'
    }
  },
}
</script>

<style scoped>

</style>
