<template>
  <div v-if="valid">
    <c-ui-messenger />
    <c-ui-breadcrumbs />
    <nuxt-child :title="title" :module="module" keep-alive />
  </div>
  <v-container v-else>
    <v-row>
      <v-col>
        <v-alert type="error" dismissible>
          <h4>{{ $t('Invalid module') }}</h4>
          <p>
            {{
              $t(
                'Your are trying to access to an invalid module, please contact technical support.'
              )
            }}
          </p>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CUiMessenger from '../components/ui/Messenger'
import CUiBreadcrumbs from '../components/ui/Breadcrumbs'
export default {
  name: 'PageCrudModuleIndex',
  components: { CUiBreadcrumbs, CUiMessenger },
  props: {
    module: {
      type: String,
      default() {
        return this.$route.params.module
      },
    },
  },
  computed: {
    valid() {
      return this.modules.includes(this.module)
    },
    modules() {
      return this.$crud.modules.map(({ name }) => name)
    },
    title() {
      return this.$tc(`module.title.${this.module}`, 2)
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
