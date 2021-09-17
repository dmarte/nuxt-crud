<template>
<v-card>
  <v-card-text>
    <template v-for='(field, index) in getResourceFields(mode, settings)'>
      <c-ui-render-field :value='field' :mode='mode' :index='index' @input='v => field.value = v'/>
    </template>
  </v-card-text>
</v-card>
</template>

<script>
import child from '../../mixins/resource/child'
import CUiRenderField from '../../components/ui/CUiRenderField'
export default {
  name: 'CrudPageResourceChildForm',
  components: { CUiRenderField },
  mixins: [child],
  async fetch() {
  }
}
</script>

<style scoped>

</style>
