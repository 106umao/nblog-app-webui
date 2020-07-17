<template>
  <div class="tag-group">
    <el-tag
    v-for="(item,index) in tagList"
    :key="index"
    :type="id%2==0&id%3==0?'success':'danger'"
    :size="id%2==0&id%3==0?'medium':'mini'"
    :effect="id%2==0&id%3==0?'plain':'dark'"
    @click="clickTag(item.id,item.content)"
    >
    {{item.content}}
  </el-tag>
  </div>
</template>
<script>
export default {
  name: 'tag-group',
  data() {
    return {
      tagList: []
    }
  },
  methods: {
    async clickTag(tagId, tagName) {
      const { data, status } = await this.$http.get('/note/list/tag/' + tagId)
      if (status === 200) {
        this.$hub.$emit('tag-click', { data, tagName })
      }
    }
  },
  async  mounted () {
    const { data, status } = await this.$http.get('/tag/list')
    if (status === 200) {
      this.tagList = data
    }
  }
}
</script>
<style scoped>
.el-tag{
  margin:5px;
  cursor: pointer;
}
</style>
