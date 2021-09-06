<template>
  <v-form @submit.prevent="$emit('save')">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text>
        <template v-for="(field, index) in fields">
          <c-ui-field-render
            :module="module"
            :display-mode="displayMode"
            :value="field.settings.value"
            :component="field.component"
            :key="`field_${index}`"
            :name="field.name"
            :label="field.label"
            :placeholder="field.placeholder"
            :type="field.type"
            :hint="field.hint"
            :min="field.settings.min_value"
            :max="field.settings.max_value"
            :settings="field.settings"
            :params="field.settings.params"
            :persistent-hint="field.settings.persistent_hint"
            :persistent-placeholder="field.settings.persistent_placeholder"
            :clearable="field.settings.clearable"
            :dense="field.settings.dense"
            :readonly="field.settings.readonly"
            :items="field.settings.items.map(mapItems)"
            :response="response"
            :disabled="!field.enabled || busy"
            @input="
              (v) => $emit('change', { fieldName: field.name, fieldValue: v })
            "
          />
        </template>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="busy"
          type="button"
          text
          @click.prevent="$emit('cancel', response)"
        >
          {{ $t('crud.actions.cancel') }}
        </v-btn>
        <v-btn :disabled="busy" type="submit" color="primary" text>
          {{ $t('crud.actions.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import CUiFieldRender from '../../components/ui/FieldRender'
import CrudResponse from '../../libs/CrudResponse'

export default {
  name: 'CUiForm',
  components: { CUiFieldRender },
  props: {
    title: {
      type: String,
      required: true,
    },
    response: {
      type: CrudResponse,
      required: true,
    },
    displayMode: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      default: () => [],
    },
    busy: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    mapItems(item) {
      if (typeof item === 'string') {
        return item
      }
      item.text = this.$te(item.text) ? this.$t(item.text) : item.text || null
      return item
    },
  },
}
</script>

<style scoped></style>
