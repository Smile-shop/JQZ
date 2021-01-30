<template>
	<article class="content">
		<i class="vip-v3-iconfont">&#xe631;</i>
		<div>礼品兑换成功！</div>
		<div class="btn" @click="goList" :style="{ 'background-color': themeColor }">查看</div>
	</article>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		computed: {
		  ...mapState({
		    themeColor: state => state.themeColor
		  })
    },
    methods: {
      goList() {
        this.$router.replace({
          path: '/gift'
        })
      }
    }
	}
</script>

<style lang="less" scoped>
.content {
	text-align: center;
	padding-top: 20px;
	font-family: PingFang-SC-Medium;
	font-size: 24px;
	color: #333333;
	i {
		font-size: 100px;
		color: #00c09a;
	}
	.btn {
		display: inline-block;
		width: 150px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-family: PingFang-SC-Medium;
		font-size: 16px;
		color: #ffffff;
		border-radius: 40px;
		background-color: red;
		margin: 30px 8px;
	}
}
</style>
