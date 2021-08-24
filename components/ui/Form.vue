<template>
  <v-form @submit.prevent="whenSave">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text>
        <template v-for="(field, index) in fields">
          <c-ui-field-render
            v-if="visible(field)"
            :key="`field_${index}`"
            :value="getValuePath(field.name, getFieldDefaultValue(field))"
            :component='field.component'
            :label='getTranslation(field.label)'
            :placeholder='field.placeholder'
            :type='field.type'
            :hint='field.hint'
            :min='field.settings.min_value'
            :max='field.settings.max_value'
            :settings='field.settings'
            :params='field.settings.params'
            :persistent-hint='field.settings.persistent_hint'
            :persistent-placeholder='field.settings.persistent_placeholder'
            :clearable='field.settings.clearable'
            :dense='field.settings.dense'
            :readonly='field.settings.readonly'
            :items='field.settings.items'
            :module="module"
            :response="response"
            :disabled="!field.enabled || processing"
            :display-mode="getDisplayMode()"
            @input="
              (v) => {
                setValuePath(field.name, v)
              }
            "
          />
        </template>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="processing"
          type="button"
          text
          @click.prevent="whenCancelled"
        >
          {{ $t('Cancel') }}
        </v-btn>
        <v-btn :disabled="processing" type="submit" color="primary" text>
          {{ $t('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import form from '../../mixins/forms'
import crud from '../../mixins/crud'
import CUiFieldRender from '../../components/ui/FieldRender'
export default {
  name: 'CUiForm',
  components: { CUiFieldRender },
  mixins: [form, crud],
  methods: {
    getDisplayMode() {
      return this.DISPLAY_MODE_FORM
    }
  }
}
</script>

<style scoped></style>
