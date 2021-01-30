<template>
	<article class="content">
		<div v-show="isRes === 'Y'">
			<div class="change-number">兑换码：<span :style="{ 'color': themeColor }">{{giftId}}</span></div>
			<img id="barcode">
			<!-- <div id="qrcode" ref="qrcode"></div> -->
			<canvas id="canvas-qr"></canvas>
		</div>
		<div class="info">请将兑换码出示给门店工作人员进行兑换</div>
		<div @click="goBack" class="goback-btn" :style="{ 'background-color': themeColor }">返回</div>
		<div class="product-content van-hairline--top-bottom" v-if="giftList.length > 0">
			<div v-for="(item, index) in giftList" :key="index">
				<img :src="computedImgUrl(item.url)" alt="decript">
				<div :style="{ 'color': themeColor }">{{item.name}}</div>
				<span class="info-number">数量：{{item.count}}</span>
			</div>
		</div>
		<div class="use-info van-hairline--bottom">
			<div class="item">
				<div class="label">姓名：</div>
				<div class="con">{{homeMemberData.name}}</div>
			</div>
			<div class="item">
				<div class="label">手机号：</div>
				<div class="con">{{homeMemberData.phone}}</div>
			</div>
			<div class="item">
				<div class="label">领取门店：</div>
				<div class="con">{{giftInfo.getShopName}}</div>
			</div>
			<div class="item">
				<div class="label">门店地址：</div>
				<div class="con">{{giftInfo.shopAddress}}</div>
			</div>
			<div class="item">
				<div class="label">门店电话：</div>
				<div class="con">{{giftInfo.shopPhone}}</div>
			</div>
		</div>
		
		<section v-if="isTimeout" class="to-reload" @click="toReload">
			<i class="vip-v3-iconfont">&#xe62a;</i>
			<div>页面超时，请点击刷新页面</div>
		</section>
	</article>
</template>

<script>
	import { mapState } from 'vuex';
	import QRCode from 'qrcodejs2';
	import QRious from 'qrious';
	import '../../../public/static/JsBarcode.all.js';
	import Submit from './Submit';
	export default {
		components: {
			Submit
		},
		computed: {
		  ...mapState({
		    themeColor: state => state.themeColor,
				homeMemberData: state => state.homeMemberData,
				urlData: state => state.urlData
		  })
		},
		data() {
			return {
				giftId: '',
				giftInfo: {
					getShopName: '',
					shopAddress: '',
					shopPhone: ''
				},
				giftList: [],
				isRes: 'Y',
				isTimeout: false,
				timer: null
			};
		},
		mounted() {
			this.giftId = this.$route.query.id;
			this.drawJsBarcode(this.giftId);
			this.drawQrCode(this.giftId);
			this.getGiftInfo(this.giftId);
		},
		methods: {
			computedImgUrl(url) {
				return `${this.httpUrl}/jop-wx-web/op/showimage?companyKey=${this.urlData.companyKey}&imgname=${url}&alias=Gift`;
			},
			drawJsBarcode(data) {
				// 生成条形码
				JsBarcode('#barcode', data, {
				  format: "CODE128",
				  displayValue: false,
				  width: 2,
				  height: 50,
					background:"#F5F5F5",
				  fontSize: 24
				});
			},
			drawQrCode(data) {
				// new QRCode('qrcode', {  
				//   width: 140,  // 设置宽度 
				//   height: 140, // 设置高度
				//   text: data
				// })
				const params = {
					element: document.getElementById('canvas-qr'),
					value: data,
					size: 244
				}
				new QRious(params);
			},
			getGiftInfo(id) {
				const params = {
					orderNum: id
				}
				this._http({url: '/jop-marketing-web/gift/queryDetail'}, params).then(res => {
					if(res.data.code === 0) {
						// console.log(res)
						const resData = res.data.data;
						if(resData) {
							this.giftInfo.getShopName = resData.shopName || '';
							this.giftInfo.shopAddress = resData.adress || '';
							this.giftInfo.shopPhone = resData.phone || '';
							this.giftList = resData.imgUrlList || [];
							this.isRes = resData.res || 'N';
							if(this.isRes === 'Y') {
								this.timer = window.setInterval(() => {
									this.getGiftStatus(id);
								}, 5000);
								window.setTimeout(() => {
									this.isTimeout = true; 
									this.clearTime();
								}, 1 * 60 * 1000);
							}
						}
					} else {
						this.$toast({
							message: res.data.msg,
							duration: 1000
						})
					}
				})
			},
			goBack() {
				this.$router.go(-1);
			},
			toReload() {
				window.location.reload();
			},
			getGiftStatus(id) {
				const params = {
					orderNum: id
				}
				this._http({url: '/jop-marketing-web/gift/queryStatus'}, params).then(res => {
					if(res.data.code === 0) {
						console.log(res)
						if(res.data.data.status === 'CFD') {
							this.clearTime();
							this.$router.replace({
								path: '/submit',
								query: {
									type: 1
								}
							})
						}
					} else {
						this.$toast({
							message: res.data.msg,
							duration: 1000
						})
					}
				})
			},
			clearTime() {
				window.clearInterval(this.timer);
				this.timer = null;
			}
		},
		destroyed() {
			this.clearTime();
		}
	}
</script>

<style lang="less" scoped>
.content {
	text-align: center;
	position: relative;
	.change-number {
		padding-top: 20px;
		text-align: center;
		font-family: PingFang-SC-Medium;
		font-size: 14px;
		color: #333333;
	}
	#barcode {
		display: block;
		margin: 0 auto;
	}
	#qrcode {
		display: inline-block;
		margin-top: 24px;
	}
	.info {
		font-family: PingFang-SC-Medium;
		font-size: 12px;
		color: #333333;
		padding: 8px;
	}
	.goback-btn {
		width: 150px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		margin: 8px auto;
		border-radius: 20px;
		font-family: PingFang-SC-Medium;
		font-size: 16px;
		color: #ffffff;
	}
	.product-content {
		width: 345px;
		margin: 20px auto 0 auto;
		padding: 8px;
		img {
			width: 137px;
		}
		div {
			font-family: PingFang-SC-Medium;
			font-size: 18px;
			padding: 8px;
		}
		.info-number {
			font-family: PingFang-SC-Medium;
			font-size: 12px;
			color: #333333;
		}
	}
	.use-info {
		width: 100%;
		.item {
			display: flex;
			font-family: PingFang-SC-Medium;
			font-size: 14px;
			color: #333333;
			padding: 0 10px;
			min-height: 30px;
			.label {
				width: 80px;
				text-align: right;
				flex-shrink: 0;
			}
			.con {
				text-align: left;
				flex-shrink: 1;
			}
		}
	}
	.to-reload {
		position: absolute;
		top: 15px;
		left: calc((100vw - 345px) / 2);
		width: 345px;
		height: 285px;
		z-index: 2000;
		// background-color: rgba(0,0,0,.85);
		background-color: rgba(0, 0, 0, .95);
		border-radius: 5px;
		color: #ffffff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 42px;
		div {
			font-family: PingFang-SC-Medium;
			font-size: 12px;
			color: #ffffff;
			margin-top: 12px;
		}
	}
}
</style>
