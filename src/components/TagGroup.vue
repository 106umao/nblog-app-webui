<template>
  <div class="tag-group">
    <div >
      <el-tag
        v-for="(item,index) in tagList"
        :key="index"
        :hit="true"
        :type="randomTyper()"
        :size="randomSize()"
        :effect="randomEffect()"
        @click="clickTag(item.id,item.content)"
        >
        {{item.content}}
      </el-tag>
    </div>
  </div>
</template>
<script>
export default {
  props: ['tagList'],
  name: 'tag-group',
  data() {
    return {
    }
  },
  methods: {
    randomEffect() {
      const effectList = ['dark ', 'light ', 'plain']
      return effectList[Math.floor(Math.random() * 3)]
    },
    randomSize() {
      const sizeList = ['medium ', 'small', 'mini']
      return sizeList[Math.floor(Math.random() * 3)]
    },
    randomTyper() {
      const typeList = ['success', 'info', 'warning', 'danger']
      return typeList[Math.floor(Math.random() * 4)]
    },
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
