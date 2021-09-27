<template>
  <v-btn v-if="params.is_whatsapp" :href="`https://wa.me/${getPhoneDialFormat(value)}`" target="_blank" text>
    <v-icon>
      mdi-whatsapp
    </v-icon>
    {{ phoneFormat(value) }}
  </v-btn>
  <span v-else>
    {{ phoneFormat(value) }}
  </span>
</template>

<script>
import field from '../../mixins/field'
import phone from '../../mixins/phones'
export default {
  name: 'CFieldPhoneIndex',
  mixins: [field, phone]
}
</script>

<style scoped>

</style>
