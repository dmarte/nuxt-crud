<template>
  <v-card flat>
    <v-toolbar flat>
      <v-card-title>
        {{
          $t('Detail resource', { resource: $tc(`module.title.${module}`,1) })
        }}
      </v-card-title>
      <v-spacer />
      <slot name="menu"></slot>
      <c-ui-options-menu
        :module="module"
        :value="model"
        :params="$attrs.params || {}"
        :key-param="keyParam"
        :with-detail="false"
        form-fullscreen
        @update:success="whenUpdated"
        @destroy:success="whenDestroyed"
      />
    </v-toolbar>
    <v-divider/>
    <v-card-text>
      <v-list :dense="dense">
        <template v-for="(head, index) in rows">
          <c-ui-field-render
            v-if="visible(head)"
            :display-mode="$store.getters['fields/DISPLAY_MODE_DETAIL']"
            :response="response"
            :name="head.name"
            :id="head.id"
            :value="head.map ? head.map(model, head.value) : get(head.value)"
            :placeholder="head.placeholder"
            :disabled="head.disabled"
            :label="resolveLabel(head)"
            :module="module"
            :params="{ head, model }"
            :field="head.field"
            :index="index"
          />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import details from '../../mixins/details'

export default {
  name: 'CUiDetail',
  mixins: [details],
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped></style>
