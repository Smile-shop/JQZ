<template>
	<article class="content">
		<i class="vip-v3-iconfont">&#xe631;</i>
		<div>{{msg}}</div>
		<div class="btn" @click="goBack()" :style="{ 'color': themeColor, 'border': `1px solid ${themeColor}` }">{{btnMsg}}</div>
		<div class="btn" @click="goRecord" :style="{ 'background-color': themeColor }">预约记录</div>
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
		data() {
			return {
				msg: '预约成功！',
				btnMsg: '继续预约'
			}
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			goRecord() {
				this.$router.replace({
					path: '/app-online',
					query: {
						navIndex: '2'
					}
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
		border-radius: 5px;
		background-color: #ffffff;
		margin: 30px 8px;
	}
}
</style>
