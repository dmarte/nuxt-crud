<template>
  <v-container>
    <v-row>
      <v-col>
        <v-breadcrumbs :items='breadcrumbs'>
          <template #item='{ item }'>
            <v-breadcrumbs-item
              :to='item.to'
              :disabled='item.disabled'
              class='text-subtitle-2 crumb-item'
              exact
            >
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
          <template #divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CUiBreadcrumbs',
  computed: {
    breadcrumbs() {
      return this.$store.state.breadcrumbs.collection
    }
  }
}
</script>

<style scoped></style>
