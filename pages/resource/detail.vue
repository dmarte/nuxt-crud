<template>
  <v-card :loading="$fetchState.pending">
    <v-card-actions>
      <v-card-title>
        {{ getResourcePageTitle(resource, mode) }}
      </v-card-title>
      <v-spacer />
      <c-ui-actions-render
        :mode="mode"
        :value="model"
        :parent-resource-id="parentResourceId"
        :parent-resource="parentResource"
        :resource="resource"
        :resource-id="resourceId"
        :actions="getResourceActionsStandalone(settings)"
        @destroy="whenDestroy"
      />
      <c-ui-actions-render
        :mode="mode"
        :value="model"
        :parent-resource-id="parentResourceId"
        :parent-resource="parentResource"
        :resource="resource"
        :resource-id="resourceId"
        :actions="getResourceActionsInline(settings)"
        @destroy="whenDestroy"
      />
    </v-card-actions>
    <v-divider />
    <c-ui-messenger />
    <v-card-text v-if="!$fetchState.pending">
      <v-list dense>
        <template v-for="(field, index) in fields">
          <c-ui-render-field
            :key="`field_${index}`"
            :index="index"
            :mode="mode"
            :value="field"
            :response="response"
            :loading="$fetchState.pending"
            dense
          />
          <v-divider v-if="fields.length > (index+1)" :key="`divider_${index}`" />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import child from '../../mixins/resource/child'
import CUiMessenger from '../../components/ui/CUiMessenger'
import CUiRenderField from '../../components/ui/CUiRenderField'
import CUiActionsRender from '../../components/ui/CUiActionRender'

export default {
  name: 'CrudPageResourceChildDetail',
  components: {
    CUiActionsRender,
    CUiMessenger,
    CUiRenderField
  },
  mixins: [child],
  async fetch () {
    try {
      await this.find({
        prefix: this.$crud.api.prefix,
        resource: this.resource,
        resourceId: this.resourceId,
        parentResourceId: this.parentResourceId,
        parentResource: this.parentResource
      })
    } catch (e) {
      this.response.parse(e)
      this.error(this.response.message)
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>
