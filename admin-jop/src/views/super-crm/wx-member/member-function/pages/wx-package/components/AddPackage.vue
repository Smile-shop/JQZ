<template>
  <article class="add-package">
    <div class="set-intro">
      <p>微信会员卡设置说明：</p>
      <p>1. 带 (数字) 的项的必须要成对出现才会有效果显示，缺一都不会显示。</p>
      <p>2. 带 (必填) 的项的必须要按照要求填写，否则无法发送到微信审核生成会员卡。</p>
      <p>3. 保存 可以保存会员卡的资料，但不会对数据项的格式做验证，也不会发送到微信审核生成或者更新会员卡，只做生成微信会员卡的预览的保存。</p>
      <p>4. 选项中所有关于金额的选项的单位均为人民币单位（分，角，元）中的“分”为单位"。</p>
    </div>

    <div class="set-content">
      <div class="phone-show">
        <PhoneShow :data="packageData" :type="isInfoDetails"></PhoneShow>
      </div>

      <div class="set-item">
        <div class="input-item">
          <div class="input-label">
            <p>Logo图片</p>
            <p>(必填)</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-upload
                  class="upload-demo"
                  :headers="uploadOpt"
                  :action="uploadUrl()"
                  :show-file-list="false"
                  :on-success="uploadLogoSuccess"
                  :on-error="uploadError"
                  name="imgFile">
                  <el-button size="small" type="primary" @click="getFocus(0)">上传图片</el-button>
                  <span class="el-upload-tip">图片格式：*jpg、png,尺寸：300px*300px</span>
                </el-upload>
                <div class="img-share">
                  <img :src="logoImg" alt="logo">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-label">
            <p>会员卡背景图片图片</p>
            <p>(必填)</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-upload
                  class="upload-demo"
                  :headers="uploadOpt"
                  :action="uploadUrl()"
                  :show-file-list="false"
                  :on-success="uploadBagSuccess"
                  :on-error="uploadError"
                  name="imgFile">
                  <el-button size="small" type="primary" @click="getFocus(0)">上传图片</el-button>
                  <span class="el-upload-tip">会员卡背景图片设计请遵循<span class="color-blue">微信会员卡自定义背景设计规范</span>,像素大小控制在1000像素*600像素以下</span>
                </el-upload>
                <div class="img-share">
                  <img :src="backgroundImg" alt="logo">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="input-item-group1">

          <div class="input-item" style="width:365px;">
            <div class="input-label">
              <p>商户名字</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.brand_name" :disabled="$route.query.statue && packageData.brand_name !== ''" :maxlength="12" placeholder="例如：金千枝首饰"></el-input>
                </div>
              </div>
              <div class="info color-red">
                字数上限为12个汉字,一旦生成微信会员卡，将无法更改
              </div>
            </div>
          </div>

          <div class="input-item" style="width:365px">
            <div class="input-label">
              <p>会员卡名</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.title" :maxlength="9" placeholder="例如：金千枝会员卡"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为9个汉字
              </div>
            </div>
          </div>

          <div class="input-item" style="width:365px">
            <div class="input-label">
              <p>会员卡使用提醒</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.notice" :maxlength="16" placeholder="例如：在付款是出示二维码"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为16个汉字
              </div>
            </div>
          </div>

          <div class="input-item" style="width:365px">
            <div class="input-label">
              <p>会员卡是否可转增</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-select @change="getFocus(0)" v-model="packageData.givefriend" placeholder="请选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="info">
              </div>
            </div>
          </div>

          <div class="input-item" style="width:365px">
            <div class="input-label">
              <p>是否显示积分信息</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-select @change="getFocus(0)" v-model="packageData.supply_bonus" :disabled="$route.query.statue && packageData.supply_bonus == '1'" placeholder="请选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="info color-red">
                此选项一旦确定选择，将无法更改为不显示。
              </div>
            </div>
          </div>

          <div class="input-item" style="width:365px">
            <div class="input-label">
              <p>初始设置积分</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.init_increase_bonus" :disabled="$route.query.statue && packageData.init_increase_bonus != ''" placeholder="例如：100"></el-input>
                </div>
              </div>
              <div class="info">
              </div>
            </div>
          </div>

        </div>

        <div class="input-item">
          <div class="input-label">
            <p>是否添加自定义</p>
            <p>顶部信息类目1</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-select @change="getFocus(0)" v-model="packageData.topInfo1.infoShow" placeholder="请选择">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="info">
            </div> 
          </div>
        </div>

        <div class="input-item-group" v-show="packageData.topInfo1.infoShow">
          <div class="input-item">
            <div class="input-label" style="width:145px">
              <p>名称1</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-select @change="getFocus(0)" v-model="packageData.topInfo1.topInfoName" placeholder="请选择">
                    <el-option label="等级" value="FIELD_NAME_TYPE_LEVEL"></el-option>
                    <el-option label="优惠券" value="FIELD_NAME_TYPE_COUPON"></el-option>
                    <el-option label="自定义顶部入口名称1" value="-1"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="info">
              </div>
            </div>
          </div>

          <div class="input-item" v-show="packageData.topInfo1.topInfoName == '-1'">
            <div class="input-label">
              <p>自定义名称1</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.topInfo1.name" :maxlength="15" placeholder="例如：微会员"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为5个汉字，15英文字母
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>跳转链接1</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.topInfo1.url" placeholder="例如：http://www.jqzms.com"></el-input>
                </div>
                <div class="input-footer">
                  <el-button icon="el-icon-search" @click="topSelectUrl('topInfo1')">选择</el-button>
                </div>
              </div>
              <div class="info">
                例如：http://www.jqzms.com
              </div>
            </div>
          </div>

        </div>

        <div class="input-item">
          <div class="input-label">
            <p>是否添加自定义</p>
            <p>顶部信息类目2</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-select @change="getFocus(0)" v-model="packageData.topInfo2.infoShow" placeholder="请选择">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="info">
            </div>
          </div>
        </div>

        <div class="input-item-group" v-show="packageData.topInfo2.infoShow">
          <div class="input-item">
            <div class="input-label">
              <p>名称2</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-select @change="getFocus(0)" v-model="packageData.topInfo2.topInfoName" placeholder="请选择">
                    <el-option label="等级" value="FIELD_NAME_TYPE_LEVEL"></el-option>
                    <el-option label="优惠券" value="FIELD_NAME_TYPE_COUPON"></el-option>
                    <el-option label="自定义顶部入口名称2" value="-1"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="info">
              </div>
            </div>
          </div>

          <div class="input-item" v-show="packageData.topInfo2.topInfoName == '-1'">
            <div class="input-label">
              <p>自定义名称2</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.topInfo2.name" :maxlength="15" placeholder="例如：微会员"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为5个汉字，15英文字母
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>跳转链接2</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.topInfo2.url" placeholder="例如：http://www.jqzms.com"></el-input>
                </div>
                <div class="input-footer">
                  <el-button icon="el-icon-search" @click="topSelectUrl('topInfo2')">选择</el-button>
                </div>
              </div>
              <div class="info">
                例如：http://www.jqzms.com
              </div>
            </div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-label">
            <p>是否添加自定义</p>
            <p>中间信息类目</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-select @change="getFocus(0)" v-model="packageData.centerInfo.center" placeholder="请选择">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="info">
            </div>
          </div>
        </div>

        <div class="input-item-group" v-show="packageData.centerInfo.center">

          <div class="input-item">
            <div class="input-label">
              <p>名称</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.centerInfo.center_title" :maxlength="9" placeholder="例如：今日金价"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为9个汉字
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>提示语</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.centerInfo.center_sub_title" placeholder="例如：黄金，千足金"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为12个汉字
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>跳转链接</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.centerInfo.center_url" placeholder="例如：http://www.jqzms.com"></el-input>
                </div>
                <div class="input-footer">
                  <!-- <Button icon="ios-search">选择</Button> -->
                  <el-button icon="el-icon-search" @click="topSelectUrl('topInfo1')">选择</el-button>
                </div>
              </div>
              <div class="info">
                例如：http://www.jqzms.com
              </div>
            </div>
          </div>

        </div>



        <div class="input-item">
          <div class="input-label">
            <p>是否添加自定义</p>
            <p>底部信息类目1</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-select @change="getFocus(0)" v-model="packageData.bottomInfo1.infoShow" placeholder="请选择">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="info">
            </div>
          </div>
        </div>

        <div class="input-item-group" v-show="packageData.bottomInfo1.infoShow">

          <div class="input-item">
            <div class="input-label">
              <p>名称1</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.bottomInfo1.name" placeholder="例如：今日金价"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为9个汉字
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>右侧提示语1</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.bottomInfo1.title" placeholder="例如：黄金，千足金"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为12个汉字
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>跳转链接1</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.bottomInfo1.url" placeholder="例如：http://www.jqzms.com"></el-input>
                </div>
                <div class="input-footer">
                  <el-button icon="el-icon-search" @click="topSelectUrl('topInfo2')">选择</el-button>
                  <!-- <Button icon="ios-search">选择</Button> -->
                </div>
              </div>
              <div class="info">
                例如：http://www.jqzms.com
              </div>
            </div>
          </div>

        </div>



        <div class="input-item">
          <div class="input-label">
            <p>是否添加自定义</p>
            <p>底部信息类目2</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-select @change="getFocus(0)" v-model="packageData.bottomInfo2.infoShow" placeholder="请选择">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="info">
            </div>
          </div>
        </div>

        <div class="input-item-group" v-show="packageData.bottomInfo2.infoShow">

          <div class="input-item">
            <div class="input-label">
              <p>名称2</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.bottomInfo2.name" :maxlength="9" placeholder="例如：今日金价"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为9个汉字
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>右侧提示语2</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.bottomInfo2.title" :maxlength="12" placeholder="例如：黄金，千足金"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为12个汉字
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>跳转链接2</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.bottomInfo2.url" placeholder="例如：http://www.jqzms.com"></el-input>
                </div>
                <div class="input-footer">
                  <!-- <Button icon="ios-search">选择</Button> -->
                  <el-button icon="el-icon-search" @click="topSelectUrl('topInfo2')">选择</el-button>
                </div>
              </div>
              <div class="info">
                例如：http://www.jqzms.com
              </div>
            </div>
          </div>

        </div>

        <div class="input-item">
          <div class="input-label">
            <p>是否添加自定义</p>
            <p>底部信息类目3</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-select @change="getFocus(0)" v-model="packageData.bottomInfo3.infoShow" placeholder="请选择">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="info">
            </div>
          </div>
        </div>

        <div class="input-item-group" v-show="packageData.bottomInfo3.infoShow">

          <div class="input-item">
            <div class="input-label">
              <p>名称3</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.bottomInfo3.name" :maxlength="9" placeholder="例如：今日金价"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为9个汉字
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>右侧提示语3</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.bottomInfo3.title" :maxlength="12" placeholder="例如：黄金，千足金"></el-input>
                </div>
              </div>
              <div class="info">
                字数上限为12个汉字
              </div>
            </div>
          </div>

          <div class="input-item">
            <div class="input-label">
              <p>跳转链接3</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input">
                  <el-input @focus="getFocus(0)" v-model="packageData.bottomInfo3.url" placeholder="例如：http://www.jqzms.com"></el-input>
                </div>
                <div class="input-footer">
                  <el-button icon="el-icon-search" @click="topSelectUrl('topInfo2')">选择</el-button>
                  <!-- <Button icon="ios-search">选择</Button> -->
                </div>
              </div>
              <div class="info">
                例如：http://www.jqzms.com
              </div>
            </div>
          </div>

        </div>



        <div class="input-item">
          <div class="input-label" style="padding-top:8px">
            <p>消费送积分</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                每消费
                <el-input-number
                  v-model="packageData.detailsInfo.cost_money_unit"
                  size="small"
                  :min="0"
                  :max="100000000"
                  @focus="getFocus(1)"
                  placeholder="例如：100"></el-input-number>
                赠送
                <el-input-number
                  v-model="packageData.detailsInfo.increase_bonus"
                  size="small"
                  :min="0"
                  :max="100000000"
                  :precision="0"
                  @focus="getFocus(1)"
                  placeholder="例如：100"></el-input-number>
                积分
              </div>
            </div>
            <div class="info">
            </div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-label" style="padding-top:8px">
            <p>单次获取积分上限</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-input-number
                  v-model="packageData.detailsInfo.max_increase_bonus"
                  size="small"
                  :min="0"
                  :max="100000000"
                  :precision="0"
                  @focus="getFocus(1)"
                  placeholder="例如：100"></el-input-number>
              </div>
            </div>
            <div class="info">
            </div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-label" style="padding-top:7px">
            <p>积分抵扣</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                每使用
                <el-input-number
                  v-model="packageData.detailsInfo.cost_bonus_unit"
                  size="small"
                  :min="0"
                  :max="100000000"
                  :precision="0"
                  @focus="getFocus(1)"
                  placeholder="例如：100"></el-input-number>
                积分，抵扣
                <el-input-number
                  v-model="packageData.detailsInfo.reduce_money"
                  size="small"
                  :min="0"
                  :max="100000000"
                  :precision="0"
                  @focus="getFocus(1)"
                  placeholder="例如：100"></el-input-number>
              </div>
            </div>
            <div class="info">
              每使用xx积分，抵扣xx元（这里以分为单位）（人民币单位：分；角；元）填100即为1元
            </div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-label" style="padding-top:7px">
            <p>抵扣条件</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                订单满
                <el-input-number
                  v-model="packageData.detailsInfo.least_money_to_use_bonus"
                  size="small"
                  :min="0"
                  :max="100000000"
                  :precision="0"
                  @focus="getFocus(1)"
                  placeholder="例如：100"></el-input-number>
                可用积分抵扣，单笔上限
                <el-input-number
                  v-model="packageData.detailsInfo.max_reduce_bonus"
                  size="small"
                  :min="0"
                  :max="100000000"
                  :precision="0"
                  @focus="getFocus(1)"
                  placeholder="例如：100"></el-input-number>
                积分
              </div>
            </div>
            <div class="info">
              满xx元可用（这里以分为单位）（人民币单位：分；角；元）填100即为1元
            </div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-label" style="padding-top:10px">
            <p>折扣</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input" style="width:80%">
                <!-- <el-input-number
                  style="width:100%"
                  v-model="packageData.detailsInfo.discount"
                  size="small"
                  :min="0"
                  :max="100000000"
                  :precision="0"
                  @focus="getFocus(1)"
                  placeholder="例如：100"></el-input-number> -->
                <el-input @focus="getFocus(1)" v-model="packageData.detailsInfo.discount" placeholder="例如：100"></el-input>
              </div>
            </div>
            <div class="info">
              该会员卡享受的折扣优惠，表示打折额度（百分比），例：填30为七折,填10就是九折。
            </div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-label">
            <p>会员卡特权说明</p>
            <p>(必填)</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input" style="width:80%">
                <el-input
                  type="textarea"
                  :autosize="{minRows: 5,maxRows: 500}"
                  @focus="getFocus(1)"
                  placeholder="例如：出示会员卡享受7折优惠"
                  maxlength="1024"
                  show-word-limit
                  v-model="packageData.detailsInfo.prerogative"></el-input>
              </div>
            </div>
          </div>
        </div>

        <div class="input-item-group2">

          <div class="input-item" style="width:50%">
            <div class="input-label">
              <p>客服电话</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input" style="width:80%">
                  <el-input @focus="getFocus(1)" v-model="packageData.detailsInfo.service_phone" placeholder="例如：88888888"></el-input>
                </div>
              </div>
              <div class="info">
              </div>
            </div>
          </div>

          <div class="input-item" style="width:50%">
            <div class="input-label">
              <p>每人可领会员卡的数量</p>
              <p>(必填)</p>
            </div>
            <div class="input-body">
              <div class="input-content">
                <div class="input" style="width:80%">
                  <el-input @focus="getFocus(1)" v-model="packageData.detailsInfo.get_limit" placeholder="例如：1"></el-input>
                </div>
              </div>
              <div class="info">
                建议会员卡每人限领一张，0代表不限制领取数量
              </div>
            </div>
          </div>

        </div>


        <div class="input-item">
          <div class="input-label">
            <p>会员卡使用说明</p>
            <p>(必填)</p>
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input" style="width:80%">
                <el-input
                  type="textarea"
                  :autosize="{minRows: 5,maxRows: 500}"
                  @focus="getFocus(1)"
                  placeholder="例如：付款时出示二维码"
                  maxlength="1024"
                  show-word-limit
                  v-model="packageData.detailsInfo.description"></el-input>
              </div>
            </div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-label">
          </div>
          <div class="input-body">
            <div class="input-content">
              <div class="input">
                <el-button type="primary" @click="postCardInfo">保存</el-button>
                <el-button type="primary" @click="createCard" :disabled="!isCardCreated">生成（更新）微信会员卡</el-button>
              </div>
              <div class="input-footer">
              </div>
            </div>
            <div class="info">
            </div>
          </div>
        </div>

      </div>
    </div>

  </article>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import PhoneShow from './PhoneShow.vue';
import user from '@/utils/user';
import { createCardInfo, postCardInfo, getCardInfo } from '@/api/super-crm/wx-member-functions';

@Component({
  components: {
    PhoneShow
  }
})
export default class AddPackage extends Vue {
  private isInfoDetails = 0;
  private logoImg = require('@/assets/images/super-crm/wx-member/no-upload.gif');
  private backgroundImg = require('@/assets/images/super-crm/wx-member/no-upload.gif');
  private packageData = {
    background_pic_url: null,
    logo_url: null,
    brand_name: null,
    title: null,
    notice: null,
    supply_bonus: '1', // 积分显示
    givefriend: '0',
    init_increase_bonus: null, // 积分数
    topInfo1: {
      infoShow: 1,
      topInfoName: '-1',
      name: null,
      url: null
    },
    topInfo2: {
      infoShow: 1,
      topInfoName: '-1',
      name: null,
      url: null
    },
    centerInfo: {
      center: 0,
      center_title: '',
      center_sub_title: '',
      center_url: ''
    },
    bottomInfo1: {
      infoShow: 0,
      name: '',
      title: '',
      url: ''
    },
    bottomInfo2: {
      infoShow: 0,
      name: '',
      title: '',
      url: ''
    },
    bottomInfo3: {
      infoShow: 0,
      name: '',
      title: '',
      url: ''
    },
    detailsInfo: {
      cost_money_unit: null, // 消费送积分。每消费*元
      increase_bonus: null, // 消费送积分。赠送*积分
      max_increase_bonus: null, // 单次获取积分上限
      cost_bonus_unit: null, // 积分抵扣。每使用*积分
      reduce_money: null, // 积分抵扣。抵扣*元
      least_money_to_use_bonus: null, // 抵扣条件。满*元
      max_reduce_bonus: null, // 抵扣条件。单笔最多使用*积分
      discount: null,
      prerogative: null, // 会员卡特权说明
      service_phone: null, // 客服电话
      get_limit: null, // 每人可领会员卡的数量
      description: null
    }
  };
  private isCardCreated = false;

  // 上传图片header设置
  get uploadOpt() {
    return {
      ticket: user.serverUser.ticket,
      companyKey: user.serverUser.account.companyKey
    }
  }

  private mounted() {
    if (this.$route.query.id) {
      this.isCardCreated = true;
      this.getCardInfo(this.$route.query.id);
    }
  }

  // 上传图片路径
  private uploadUrl(): string {
    return `${VUE_APP_BASE_API}/jop-wx-web/memberCard/uploadCardImg`;
  }

  private uploadLogoSuccess(res: any) {
    if (res.code === 0) {
      this.packageData.logo_url = res.data;
      this.logoImg = res.data;
      this.$message({
        type: 'success',
        message: '上传成功！'
      });
    } else {
      this.uploadError();
    }
  }

  private uploadError() {
    this.$message.error('上传失败，请重新上传！');
  }

  private uploadBagSuccess(res: any) {
    if (res.code == 0) {
      this.packageData.background_pic_url = res.data;
      this.backgroundImg = res.data;
      this.$message({
        type: 'success',
        message: '上传成功！'
      });
    } else {
      this.uploadError();
    }
  }

  // 选择手机展示模式
  private getFocus(data: any) {
    this.isInfoDetails = data;
  }

  private postCardInfo() {
    if (!this.packageData.logo_url) {
      this.$message('logo图片不能为空！');
      return;
    };
    if (!this.packageData.background_pic_url) {
      this.$message('背景图片不能为空！');
      return;
    };
    if (!this.packageData.brand_name) {
      this.$message('商户名字不能为空！');
      return;
    };
    if (!this.packageData.title) {
      this.$message('会员卡号不能为空！');
      return;
    };
    if (!this.packageData.notice) {
      this.$message('会员卡使用提醒不能为空！');
      return;
    };
    if (this.packageData.topInfo1.infoShow) {
      if (this.packageData.topInfo1.topInfoName == '-1' && !this.packageData.topInfo1.name) {
        this.$message('顶部信息类1名称不能为空！');
        return;
      };
      if (!this.packageData.topInfo1.url) {
        this.$message('顶部信息类1链接不能为空！');
        return;
      };
    };
    if (this.packageData.topInfo2.infoShow) {
      if (this.packageData.topInfo2.topInfoName == '-1' && !this.packageData.topInfo2.name) {
        this.$message('顶部信息类2名称不能为空！');
        return;
      };
      if (!this.packageData.topInfo2.url) {
        this.$message('顶部信息类2链接不能为空！');
        return;
      };
    };
    if (!this.packageData.init_increase_bonus) {
      this.$message('初始积分不能为空！');
      return;
    };
    if (this.packageData.centerInfo.center) {
      if (this.packageData.centerInfo.center_title == '') {
        this.$message('中间信息类名称不能为空！');
        return;
      };
      if (this.packageData.centerInfo.center_sub_title == '') {
        this.$message('中间信息类提示语不能为空！');
        return;
      };
      if (this.packageData.centerInfo.center_url == '') {
        this.$message('中间信息类跳转链接不能为空！');
        return;
      };
    };
    if (this.packageData.bottomInfo1.infoShow) {
      if (this.packageData.bottomInfo1.name == '') {
        this.$message('底部信息类1名称不能为空！');
        return;
      };
      if (this.packageData.bottomInfo1.title == '') {
        this.$message('底部信息类1提示语不能为空！');
        return;
      };
      if (this.packageData.bottomInfo1.url == '') {
        this.$message('底部信息类1跳转链接不能为空！');
        return;
      };
    };
    if (this.packageData.bottomInfo2.infoShow) {
      if (this.packageData.bottomInfo2.name == '') {
        this.$message('底部信息类2名称不能为空！');
        return;
      };
      if (this.packageData.bottomInfo2.title == '') {
        this.$message('底部信息类2提示语不能为空！');
        return;
      };
      if (this.packageData.bottomInfo2.url == '') {
        this.$message('底部信息类2跳转链接不能为空！');
        return;
      };
    };
    if (this.packageData.bottomInfo3.infoShow) {
      if (this.packageData.bottomInfo3.name == '') {
        this.$message('底部信息类3名称不能为空！');
        return;
      };
      if (this.packageData.bottomInfo3.title == '') {
        this.$message('底部信息类3提示语不能为空！');
        return;
      };
      if (this.packageData.bottomInfo3.url == '') {
        this.$message('底部信息类3跳转链接不能为空！');
        return;
      };
    };
    if (!this.packageData.detailsInfo.prerogative) {
      this.$message('会员卡特权说明不能为空！');
      return;
    }
    if (!this.packageData.detailsInfo.get_limit) {
      this.$message('每人可领会员卡的数量不能为空！');
      return;
    }
    if (!this.packageData.detailsInfo.description) {
      this.$message('会员卡使用说明不能为空！');
      return;
    }
    return this.postMemberCardInfo(this.packageData);
  }

  private postMemberCardInfo(data: any) {
    const custome = {
      FIELD_NAME_TYPE_LEVEL: '等级',
      FIELD_NAME_TYPE_COUPON: '优惠券'
    };
    const customField1 = data.topInfo1.infoShow ? {
      name: data.topInfo1.topInfoName == '-1' ? data.topInfo1.name : (custome as any)[data.topInfo1.topInfoName],
      name_type: data.topInfo1.topInfoName == '-1' ? '' : data.topInfo1.topInfoName,
      url: data.topInfo1.url,
    } : '0';
    const customField2 = data.topInfo2.infoShow ? {
      name: data.topInfo2.topInfoName == '-1' ? data.topInfo2.name : (custome as any)[data.topInfo2.topInfoName],
      name_type: data.topInfo2.topInfoName == '-1' ? '' : data.topInfo2.topInfoName,
      url: data.topInfo2.url,
    } : '0';
    const params = {
      background_pic_url: data.background_pic_url,
      logo_url: data.logo_url,
      brand_name: data.brand_name,
      title: data.title,
      color: 'Color010',
      notice: data.notice,
      service_phone: data.detailsInfo.service_phone,
      description: data.detailsInfo.description,
      get_limit: data.detailsInfo.get_limit,
      custom_field1: customField1,
      custom_field2: customField2,
      custom_field3: '0',
      center: data.centerInfo.center ? '1' : '0',
      center_title: data.centerInfo.center ? data.centerInfo.center_title : '',
      center_sub_title: data.centerInfo.center ? data.centerInfo.center_sub_title : '',
      center_url: data.centerInfo.center ? data.centerInfo.center_url : '',
      custom: data.bottomInfo1.infoShow ? '1' : '0',
      custom_url_name: data.bottomInfo1.infoShow ? data.bottomInfo1.name : '',
      custom_url: data.bottomInfo1.infoShow ? data.bottomInfo1.url : '',
      custom_url_sub_title: data.bottomInfo1.infoShow ? data.bottomInfo1.title : '',
      custom_cell1: data.bottomInfo2.infoShow ? {
        name: data.bottomInfo2.name,
        tips: data.bottomInfo2.title,
        url: data.bottomInfo2.url
      } : '0',
      promotion: data.bottomInfo3.infoShow ? '1' : '0',
      promotion_url_name: data.bottomInfo3.infoShow ? data.bottomInfo3.name : '',
      promotion_url: data.bottomInfo3.infoShow ? data.bottomInfo3.url : '',
      promotion_url_sub_title: data.bottomInfo3.infoShow ? data.bottomInfo3.title : '',
      supply_bonus: data.supply_bonus,
      bonus_url: `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}&page=score-record`,
      prerogative: data.detailsInfo.prerogative,
      bonus_rules: '',
      discount: data.detailsInfo.discount || '0',
      givefriend: data.givefriend,
      isshare: '0',
      activate_url: `${VUE_APP_BASE_API}/wx-interface-web/wx/auth?companyKey=${user.serverUser.account.companyKey}&page=active`,
      cost_money_unit: data.detailsInfo.cost_money_unit,
      increase_bonus: data.detailsInfo.increase_bonus,
      max_increase_bonus: data.detailsInfo.max_increase_bonus,
      init_increase_bonus: data.init_increase_bonus,
      cost_bonus_unit: data.detailsInfo.cost_bonus_unit,
      reduce_money: data.detailsInfo.reduce_money,
      least_money_to_use_bonus: data.detailsInfo.least_money_to_use_bonus,
      max_reduce_bonus: data.detailsInfo.max_reduce_bonus,
    }
    postCardInfo(params).then((res: any) => {
      this.isCardCreated = true;
      this.$message({
        type: 'success',
        message: '保存成功！'
      });
    })
  }

  private createCard() {
    const params = {
      id: this.$route.query.id
    }
    createCardInfo(params).then((res: any) => {
      this.$message({
        type: 'success',
        message: '提交成功！'
      });
    })
  }

  private getCardInfo(id: any) {
    getCardInfo({id}).then((res: any) => {
      const info = res.data;
      this.packageData.background_pic_url = info.background_pic_url;
      this.backgroundImg = info.background_pic_url;
      const baseInfo = JSON.parse(info.base_info);
      // console.log(baseInfo)
      this.packageData.logo_url = baseInfo.logo_url;
      this.logoImg = baseInfo.logo_url;
      this.packageData.brand_name = baseInfo.brand_name;
      this.packageData.title = baseInfo.title;
      this.packageData.notice = baseInfo.notice;
      this.packageData.supply_bonus = info.supply_bonus;
      this.packageData.givefriend = info.givefriend;
      const bonusrRule = JSON.parse(info.bonus_rule);
      // console.log(bonusrRule)
      this.packageData.init_increase_bonus = bonusrRule.init_increase_bonus;
      // let custom_field1 = JSON.parse(info.custom_field1);
      // let custom_field2 = JSON.parse(info.custom_field2);
      // console.log(custom_field2)
      this.packageData.topInfo1 = this.computedCustom(JSON.parse(info.custom_field1));
      this.packageData.topInfo2 = this.computedCustom(JSON.parse(info.custom_field2));
      this.packageData.centerInfo = this.computedCenter(info.center, baseInfo);
      this.packageData.bottomInfo1 = this.computedbottom1(info.custom, baseInfo);
      this.packageData.bottomInfo2 = this.computedbottom2(JSON.parse(info.custom_cell1));
      this.packageData.bottomInfo3 = this.computedbottom3(info.promotion, baseInfo);
      this.packageData.detailsInfo.cost_money_unit = bonusrRule.cost_money_unit;
      this.packageData.detailsInfo.increase_bonus = bonusrRule.increase_bonus;
      this.packageData.detailsInfo.max_increase_bonus = bonusrRule.max_increase_bonus;
      this.packageData.detailsInfo.cost_bonus_unit = bonusrRule.cost_bonus_unit;
      this.packageData.detailsInfo.reduce_money = bonusrRule.reduce_money;
      this.packageData.detailsInfo.least_money_to_use_bonus = bonusrRule.least_money_to_use_bonus;
      this.packageData.detailsInfo.max_reduce_bonus = bonusrRule.max_reduce_bonus;
      this.packageData.detailsInfo.discount = info.discount;
      this.packageData.detailsInfo.prerogative = info.prerogative;
      this.packageData.detailsInfo.service_phone = baseInfo.service_phone;
      this.packageData.detailsInfo.get_limit = baseInfo.get_limit;
      this.packageData.detailsInfo.description = baseInfo.description;
    })
  }

  private computedCustom(data: any) {
    if (data) {
      return {
        infoShow: 1,
        topInfoName: data.name_type == '' ? '-1' : data.name_type,
        name: data.name,
        url: data.url
      }
    } else {
      return {
        infoShow: 0,
        topInfoName: '-1',
        name: null,
        url: null
      }
    }
  }

  private computedCenter(has: any, data: any) {
    if (has == '1') {
      return {
        center: 1,
        center_title: data.center_title,
        center_sub_title: data.center_sub_title,
        center_url: data.center_url
      }
    } else {
      return {
        center: 0,
        center_title: '',
        center_sub_title: '',
        center_url: ''
      }
    }
  }

  private computedbottom1(has: any, data: any) {
    if (has == '1') {
      return {
        infoShow: 1,
        name: data.custom_url_name,
        title: data.custom_url_sub_title,
        url: data.custom_url
      }
    } else {
      return {
        infoShow: 0,
        name: '',
        title: '',
        url: ''
      }
    }
  }

  private computedbottom2(data: any) {
    if (data) {
      return {
        infoShow: 1,
        title: data.tips,
        name: data.name,
        url: data.url
      }
    } else {
      return {
        infoShow: 0,
        title: '',
        name: '',
        url: ''
      }
    }
  }

  private computedbottom3(has: any, data: any) {
    if (has == '1') {
      return {
        infoShow: 1,
        name: data.promotion_url_name,
        title: data.promotion_url_sub_title,
        url: data.promotion_url
      }
    } else {
      return {
        infoShow: 0,
        name: '',
        title: '',
        url: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-package {
  .set-intro {
    width: 100%;
    height: 167px;
    background-color: #f5faff;
    padding: 10px 20px;
    border-radius: 5px;
    border: solid 1px #409eff;
    p {
      font-size: 14px;
      line-height: 28px;
      color: #333333;
    }
  }

  .set-content {
    width: 100%;
    display: flex;
    .phone-show {
      width: 358px;
    }
    .set-item {
      flex-basis: 50%;
      flex-grow: 1;
      height: calc(100vh - 428px);
      overflow: auto;
      .input-item {
        display: flex;
        margin-top: 15px;
        .input-label {
          width: 160px;
          text-align: right;
          padding-right: 12px;
          font-size: 12px;
          color: #606266;
        }
        .input-body {
          .info {
            font-size: 12px;
            color: #999999;
            padding-top: 8px;
          }
          .img {
            width: 100px;
            height: 100px;
            img {
              width: 100%;
              padding-top: 6px;
            }
          }
          .color-red {
            color: #ff0000;
          }
          .color-blue {
            color: #337ab7;
          }
          flex-basis: 50%;
          flex-grow: 1;
          .input-content {
            display: flex;
            align-items: center;
            .input {
              font-size: 12px;
              color: #606266;
              .el-upload-tip {
                font-family: MicrosoftYaHei;
                font-size: 12px;
                color: #999999;
                padding-left: 13px;
              }
              .img-share {
                margin-top: 12px;
                width: 280px;
                img {
                  width: 50%;
                }
              }
            }
            .input-footer {
              flex-basis: 20%;
              flex-grow: 1;
              color: #ff0000;
              padding-left: 12px;
            }
          }
        }
      }
      .input-item-group1 {
        width: calc(100% - 30px);
        display: flex;
        flex-wrap: wrap;
      }
      .input-item-group {
        width: calc(100% - 30px);
        margin: 0 auto;
        background-color: #f5f5f5;
        display: flex;
        padding-bottom: 12px;
      }
      .input-item-group2 {
        width: calc(100% - 150px);
        display: flex;
      }
    }
  }

}
</style>
