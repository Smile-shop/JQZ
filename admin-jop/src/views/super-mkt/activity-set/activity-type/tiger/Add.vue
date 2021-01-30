<template>
  <div>
    <Add @checkTitleSuccess="add"></Add>
  </div>
</template>

<script>
import { addGame } from '@/api/super-mkt/activity-set/tiger'
import Add from '../set-template/Add'
export default {
  components: {
    Add
  },
  methods: {
    async add(title) {
      try {
        const options = {
          activityName: title,
          parentActive: '老虎机'
        }
        const { msg } = await addGame(options)
        this.$message.success(msg)
      } catch (error) {
        console.log('TCL: add -> error', error)
      }
    }
  }
}
</script>

<style>
</style>
