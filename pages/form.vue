<template>
  <c-ui-form
    :value="model"
    :module="module"
    :display-mode="displayMode"
    :title="getModulePageTitle(module)"
    :fields="getModuleFieldsUsedInForms(module, model)"
    :response="response"
    :busy="$fetchState.pending || processing"
    :actions="getModuleActions(module)"
    @change="({ fieldName, fieldValue }) => setModelPath(fieldName, fieldValue)"
    @save="whenSave"
    @cancel="whenCancelled"
  />
</template>

<script>
import CUiForm from '../components/ui/Form'
import pageResource from '../mixins/pageResource'
export default {
  name: 'CPageForms',
  components: { CUiForm },
  mixins: [pageResource],
  props: {
    module: {
      type: String,
      required: true,
    },
  },
  async fetch() {
    if (this.isModuleInUpdateMode(this.module)) {
      await this.find()
    }
  },
  computed: {
    displayMode() {
      return this.DISPLAY_MODE_FORM
    },
  },
}
</script>

<style scoped></style>
