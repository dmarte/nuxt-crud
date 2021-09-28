<template>
  <span>
    {{ currentValue }}
  </span>
</template>

<script>
import select from '../../mixins/select'
import field from '../../mixins/resource/field'
export default {
  name: 'CFieldSelectIndex',
  mixins: [select, field]
}
</script>
