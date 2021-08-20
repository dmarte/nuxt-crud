<template>
  <v-card flat outlined>
    <v-card-title>
      {{ $t('Are you sure you want to delete the resource?') }}
    </v-card-title>
    <v-card-text>
      {{ $t("When deleted, you can't recover this information.") }}
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="busy" text @click="$emit('cancel')">
        {{ $t('Cancel') }}
      </v-btn>
      <v-btn
        :loading="busy"
        :disabled="busy"
        color="red"
        text
        @click.prevent="$emit('confirmed')"
      >
        <v-icon> mdi-trash-can-outline </v-icon>
        {{ $t('Delete') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'CUiDeleteConfirmation',
  props: {
    busy: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style scoped>

</style>
