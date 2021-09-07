<template>
  <c-ui-detail
    :title="getModulePageTitle(module)"
    :display-mode="displayMode"
    :fields="getModuleFieldsUsedInDetail(module, model)"
    :module="module"
    :form-width="settings.width"
    :form-fullscreen="settings.fullscreen"
    :form-name="settings.form"
    :dense="settings.dense"
    :value="model"
    :busy="$fetchState.pending"
    :response="response"
  >
    <template #toolbar>
      <c-ui-actions-render
        :module="module"
        :display-mode="displayMode"
        :actions="actions.filter(({standalone}) => standalone)"
        :dense='settings.dense'
        :value='model'
        standalone

      />
      <c-ui-actions-render
        :module="module"
        :display-mode="displayMode"
        :actions="actions"
        :dense='settings.dense'
        :value='model'
        @destroy='whenDestroy'
      />
    </template>
  </c-ui-detail>
</template>

<script>
import pageResource from '../mixins/pageResource'
import CUiDetail from '../components/ui/Detail'
import CUiActionsRender from '../components/ui/ActionsRender'
import _ from 'lodash'
export default {
  name: 'PageCrudDetailPage',
  components: { CUiActionsRender, CUiDetail },
  mixins: [pageResource],
  props: {
    module: {
      type: String,
      required: true,
    },
  },
  async fetch() {
    await this.find()
  },
  computed: {
    settings() {
      return this.getModuleSettings(this.module)
    },
    actions() {
      return this.getModuleActions(this.module)
    },
    displayMode() {
      return this.DISPLAY_MODE_DETAIL
    },
  },
  methods: {
    mapModuleFieldToDetail(field, resource) {
      field.value = this.getModelPath(
        field.name,
        _.get(resource, field.name, null)
      )
      return field
    },
  },
}
</script>

<style scoped></style>
