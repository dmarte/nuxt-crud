<template>
  <v-card flat>
    <v-toolbar flat>
      <v-toolbar-title>
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <slot name="toolbar" />
    </v-toolbar>
    <v-divider />
    <v-card-text>
      <v-list :dense="dense">
        <template v-for="(field, index) in fields">
          <v-list-item v-if="busy" :key="`loader_${index}`">
            <v-list-item-title>
              {{ field.label }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-skeleton-loader type="list-item-two-line" loading />
            </v-list-item-subtitle>
          </v-list-item>
          <c-ui-field-render
            v-if="!busy"
            :key="`field_${index}`"
            :index="index"
            :module="module"
            :display-mode="displayMode"
            :component="field.component"
            :response="response"
            :name="field.name"
            :value="field.value"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :label="field.label"
            :params="field.settings.params"
            :items="field.settings.items"
          />
          <v-divider :key="`divider_${index}`" />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import CrudResponse from '../../libs/CrudResponse'
import CUiFieldRender from './FieldRender'
export default {
  name: 'CUiDetail',
  components: { CUiFieldRender },
  props: {
    displayMode: {
      type: String,
      required: true
    },
    response: {
      type: CrudResponse,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      default: () => []
    },
    dense: {
      type: Boolean,
      default: false
    },
    busy: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formOpened: false
    }
  }
}
</script>
