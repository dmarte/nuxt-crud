<template>
  <span>
    {{ currentValue }}
  </span>
</template>

<script>
import select from '../../mixins/select'
export default {
  name: 'SelectIndex',
  mixins: [select]
}
</script>
