<template>
	<article class="content">
		<div class="input-item">
			<div class="input-title">
				领取门店
				<span>*</span>
			</div>
			<div class="input-content select-content" @click="selectShow = true">
				<span>{{selectedShop.shopName}}</span>
				<i class="vip-v3-iconfont">&#xe696;</i>
			</div>
		</div>

		<div class="input-item">
			<div class="input-title">姓名</div>
			<div class="input-content">
				<span>{{ homeMemberData.name }}</span>
			</div>
		</div>

		<div class="input-item">
			<div class="input-title">手机号</div>
			<div class="input-content">
				<span>{{ homeMemberData.phone }}</span>
			</div>
		</div>

		<div class="data-btn" @click="submitData" :style="{ 'background-color': themeColor }">提交</div>
		<div class="data-go" @click="goUpdate" :style="{ color: themeColor }">如会员资料有误，请点此完善</div>

		<section class="poup-content" v-if="selectShow">
			<div class="shop-content">
				<div class="content">
					<nav class="title van-hairline--bottom">选择附近门店</nav>
					<div class="shop-list">
						<div class="shop-detail van-hairline--bottom" @click="selectShop(item)" v-for="(item, index) in shopList" :key="index">
							<div class="shop-name">
								<div class="name" :style="{ color: themeColor }">{{item.shopName}}</div>
								<div class="map" v-if="index === 0">
									<i class="vip-v3-iconfont">&#xe611;</i>
									距离最近
								</div>
							</div>

							<div class="shop-address-phone">
								<div class="address-phone">
									<div>地址：{{item.address}}</div>
									<div>电话：{{item.phone}}</div>
								</div>
								<div class="select-icon">
									<i class="vip-v3-iconfont" v-if="computedSelectShop(item)" :style="{ color: themeColor }">&#xe631;</i>
									<i class="vip-v3-iconfont" v-else>&#xe6da;</i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</article>
</template>

<script>
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState({
			themeColor: state => state.themeColor,
			homeMemberData: state => state.homeMemberData,
			urlData: state => state.urlData
		}),
		user() {
			const userStr = window.localStorage.getItem('urlData');
			if (userStr) {
				return JSON.parse(userStr);
			}
		}
	},
	data() {
		return {
			selectShow: false,
			selectedShop: {
				shopName: ''
			},
			shopList: []
		};
	},
	mounted() {
		this.getShopList();
	},
	methods: {
		computedSelectShop(shopItem) {
			return this.selectedShop.shopId === shopItem.shopId;
		},
		getShopList() {
			const params = {
				latitude: 36.2088230928,
				longitude: 99.1406250000
			}
			this._http({url: '/jop-web/integral/shopinfo'}, params).then(res => {
				if(res.data.code === 0) {
					// console.log(res)
					this.shopList = res.data.data || [];
				} else {
					this.$toast({
						message: res.data.msg,
						duration: 1000
					})
				}
			})
		},
		selectShop(shopItem) {
			this.selectedShop = shopItem;
			this.selectShow = false;
		},
		submitData() {
			const params = {
				shopName: this.selectedShop.shopName,
				name: this.homeMemberData.name,
				phone: this.homeMemberData.phone
			};
			if (params.shopName && params.name && params.phone) {
				const params = {
				  store: params.shopName,
					orderNum: this.$route.query.id
				}
				this._http({url: '/jop-marketing-web/gift/updateStore'}, params).then(res => {
				  if(res.data.code === 0) {
				    console.log(res)
				    this.$router.replace({
				    	path: '/submit'
				    });
				  } else {
				    this.$toast({
				      message: res.data.msg,
				      duration: 1000
				    })
				  }
				})
			} else {
				this.$toast({
					message: '您的信息还未完善！',
					duration: 1000
				});
			}
		},
		goUpdate() {
			this.$router.push({
				path: '/up-info'
			});
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	width: 100%;
	height: calc(100vh - 75px);
	.input-item {
		width: 345px;
		margin: 15px auto;
		.input-title {
			font-family: PingFang-SC-Medium;
			font-size: 14px;
			color: #333333;
			padding-bottom: 8px;
			span {
				color: #d41010;
			}
		}
		.input-content {
			width: 100%;
			height: 40px;
			line-height: 40px;
			background-color: #dddddd;
			color: #666666;
			font-family: PingFang-SC-Medium;
			font-size: 14px;
			span {
				padding-left: 12px;
			}
		}
		.select-content {
			background-color: #ffffff;
			border: solid 1px #dddddd;
			.vip-v3-iconfont {
				float: right;
				margin-right: 8px;
			}
		}
	}
	.data-btn {
		width: 345px;
		height: 40px;
		line-height: 40px;
		margin: 30px auto 15px auto;
		text-align: center;
		color: #ffffff;
		border-radius: 20px;
		font-family: PingFang-SC-Medium;
		font-size: 16px;
	}
	.data-go {
		font-family: PingFang-SC-Medium;
		font-size: 14px;
		text-align: center;
	}
	.poup-content {
		background-color: rgba(0, 0, 0, 0.5);
		height: 100%;
		width: 100%;
		position: fixed;
		z-index: 2000;
		top: 0;
		left: 0;
		.shop-content {
			height: 100%;
			position: relative;
			.content {
				position: absolute;
				width: 100%;
				height: 425px;
				bottom: 0;
				background-color: #ffffff;
				.title {
					height: 44px;
					line-height: 44px;
					font-family: PingFang-SC-Medium;
					font-size: 16px;
					color: #333333;
					padding-left: 8px;
				}
				.shop-list {
					height: 382px;
					overflow: auto;
					.shop-detail {
						.shop-name {
							display: flex;
							padding: 12px 12px 0 12px;
							justify-content: space-between;
							.name {
								font-size: 14px;
							}
							.map {
								font-size: 11px;
								color: #999999;
								i {
									margin-right: 12px;
								}
							}
						}
						.shop-address-phone {
							display: flex;
							justify-content: space-between;
							align-items: center;
							height: 50px;
							padding: 0 12px;
							.address-phone {
								font-family: PingFang-SC-Medium;
								font-size: 12px;
								color: #666666;
							}
							.select-icon {
								font-size: 20px;
								color: #dddddd;
							}
						}
					}
				}
			}
		}
	}
}
</style>
