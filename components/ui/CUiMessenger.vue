<template>
  <v-snackbar
    v-model="opened"
    :color="$store.state.messenger.type"
    dark
  >
    {{ $store.state.messenger.text }}
    <template #action="{ attrs }">
      <v-btn
        v-bind="attrs"
        text
        @click="$store.commit('messenger/close')"
      >
        {{ $t('Close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'CUiMessenger',
  data () {
    return {
      opened: false
    }
  },
  watch: {
    opened (value) {
      if (!value) {
        this.$store.commit('messenger/close')
      }
    }
  },
  mounted () {
    this.$store.watch(({ messenger }) => messenger.opened, (opened) => {
      this.opened = opened
    })
  }
}
</script>

<style scoped></style>
