<template>
  <v-list-item :key="`item_${value}`">
    <v-list-item-subtitle>
      {{ label }}
    </v-list-item-subtitle>
    <v-list-item-title>
      <slot>
        <v-btn v-if="params.is_whatsapp" :href="`https://wa.me/${getPhoneDialFormat(value)}`" target="_blank" text>
          <v-icon>
            mdi-whatsapp
          </v-icon>
          {{ phoneFormat(value) }}
        </v-btn>
        <template v-else>
          {{ phoneFormat(value) }}
        </template>
      </slot>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import field from '../../mixins/field'
import phones from '../../mixins/phones'
export default {
  name: 'CFieldPhoneDetail',
  mixins: [field, phones]
}
</script>

<style scoped>

</style>
