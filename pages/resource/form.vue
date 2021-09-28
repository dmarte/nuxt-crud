<template>
  <v-form @submit.prevent="whenSave">
    <c-ui-messenger />
    <v-card :loading="busy">
      <v-card-title>
        {{ getResourcePageTitle(settings.name, mode) }}
      </v-card-title>
      <v-card-text>
        <template v-for="(field, index) in fields">
          <c-ui-render-field
            :key="`field_${index}`"
            :index="index"
            :mode="mode"
            :response="response"
            :disabled="busy"
            :value="field"
            @input="f => whenFieldChange(f, index)"
          />
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="busy"
          text
          @click="whenCancel"
        >
          {{ $t('crud.actions.cancel') }}
        </v-btn>
        <v-btn
          :loading="busy"
          color="primary"
          type="submit"
        >
          {{ $t('crud.actions.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import child from '../../mixins/resource/child'
import CUiRenderField from '../../components/ui/CUiRenderField'
import CUiMessenger from '../../components/ui/CUiMessenger'

export default {
  name: 'CrudPageResourceChildForm',
  components: {
    CUiMessenger,
    CUiRenderField
  },
  mixins: [child],
  data () {
    return {
      processing: false
    }
  },
  async fetch () {
    if (this.shouldFetchResource) {
      await this.find({
        prefix: this.$crud.api.prefix,
        resource: this.resource,
        resourceId: this.resourceId,
        parentResource: this.parentResource,
        parentResourceId: this.parentResourceId
      })
    }
  },
  computed: {
    busy () {
      return this.$fetchState.pending || this.processing
    }
  },
  methods: {
    whenFieldChange (field, index) {
      this.fields.splice(index, 1, field)
    },
    async whenCancel () {
      this.response.reset()
      this.fields = this.getResourceFields(this.mode, this.settings)
      await this.redirectIfNeeded()
    },
    url () {
      return this.getResourceUrl({
        resourceId: this.resourceId,
        resource: this.resource,
        parentResourceId: this.parentResourceId,
        parentResource: this.parentResource
      })
    },
    async store () {
      this.model = this.buildResourceModel(this.fields)
      if (this.settings.hooks.beforeCreate) {
        this.$store.dispatch(this.settings.hooks.beforeCreate, this.model)
      }
      return await this.$axios.$post(this.url(), this.model)
    },
    async update () {
      this.model = this.buildResourceModel(this.fields)
      if (this.settings.hooks.beforeUpdate) {
        this.$store.dispatch(this.settings.hooks.beforeUpdate, this.model)
      }
      return await this.$axios.$put(this.url(), this.model)
    },
    async whenSave () {
      this.processing = true
      try {
        this.model = this.isUpdating ? await this.update() : await this.store()
        if (this.isUpdating) {
          this.success(this.getTranslationForSuccessUpdate(this.resource))
        } else {
          this.success(this.getTranslationForSuccessCreate(this.resource))
        }
        await this.redirectIfNeeded()
      } catch (exception) {
        this.response.parse(exception)
        this.error(this.$te(this.response.message) ? this.$t(this.response.message) : this.response.message)
        this.$vuetify.goTo(0)
      } finally {
        this.processing = false
      }
    },
    async redirectIfNeeded () {
      if (this.$route.query.redirect) {
        await this.$router.push(this.$route.query.redirect)
      } else {
        // IMPORTANT:
        // If the model not contains the primary key
        // it will redirect to the listing page
        await this.$router.push(
          this.getResourceUrl({
            parentResource: this.parentResource,
            parentResourceId: this.parentResourceId,
            resource: this.resource,
            resourceId: this.getPrimaryKeyValue(),
            prefix: '/c/'
          })
        )
      }
    }
  }
}
</script>

<style scoped>

</style>
