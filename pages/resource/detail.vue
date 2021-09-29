<template>
  <v-card :loading="$fetchState.pending">
    <v-card-actions>
      <v-card-title v-if="!hasTabs">
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
      <template v-if="hasTabs">
        <v-tabs v-model="currentTab" fixed-tabs show-arrows>
          <v-tabs-slider color="primary lighten-3" />
          <v-tab key="crud-detail">
            {{ getResourcePageTitle(resource, mode) }}
          </v-tab>
          <template v-for="tab in fields.filter(({is}) => is ==='CFieldTab')">
            <v-tab :key="tab.name">
              {{ tab.label }}
            </v-tab>
          </template>
          <template v-for="field in fields.filter(({is}) => is ==='CFieldHasMany')">
            <v-tab :key="field.name">
              {{ field.label }}
            </v-tab>
          </template>
        </v-tabs>
        <v-tabs-items v-model="currentTab">
          <v-tab-item key="crud-detail">
            <v-list dense>
              <template v-for="(field, index) in fields.filter(({is}) => !['CFieldTab','CFieldHasMany'].includes(is))">
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
          </v-tab-item>
          <template v-for="tab in fields.filter(({is}) => is === 'CFieldTab')">
            <v-tab-item :key="tab.name" eager>
              <v-list dense>
                <template v-for="(field, index) in tab.params.fields">
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
            </v-tab-item>
          </template>
          <template v-for="(relation, index) in fields.filter(({is}) => is === 'CFieldHasMany')">
            <v-tab-item :key="relation.name">
              <c-ui-render-field
                :key="`field_${relation.name}`"
                :index="index"
                :value="relation"
                :response="response"
                :loading="$fetchState.pending"
                :mode="mode"
                dense
              />
            </v-tab-item>
          </template>
        </v-tabs-items>
      </template>
      <template v-else>
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
      </template>
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
  data () {
    return {
      currentTab: 'crud-detail'
    }
  },
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
  },
  computed: {
    hasTabs () {
      return this.fields.some(({ is }) => is === 'CFieldTab')
    }
  }
}
</script>

<style scoped>

</style>
