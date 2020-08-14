
<template>
<div class="wuxain">
  <ul class="infinite-list" v-infinite-scroll="load"  >
    <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
  </ul>
</div>
</template>
<script>
export default {
  data () {
    return {
      count: 100
    }
  },
  methods: {
    load () {
      this.count += 2
    }
  }
}
</script>
<style scoped>

</style>
