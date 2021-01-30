<template>
  <base-layout
    :isShowFooter="false"
    :isShowHeader="true"
    :isShowHeaderLogin="false"
    title="收货地址"
  >
    <article
      id="location-create"
    >
      <ul>
        <li>
          <input
            v-model="addressee"
            type="text"
            placeholder="收货人"
          >
        </li>
        <li>
          <input
            v-model="phone"
            type="number"
            placeholder="联系电话"
          >
        </li>
        <li
          class="district"
          @click="isShowAddressPicker = true"
        >
          <div
            class="left"
          >
           {{getAddress || '选择省、市、区'}}
          </div>
          <div>
            <i class="iconfont icon-you"></i>
          </div>
        </li>
        <li>
          <input
            v-model="street"
            type="text"
            placeholder="详细地址"
          >
        </li>
        <li>
          <Checkbox
            v-model="isDefault"
          >
            设为默认
          </Checkbox>
        </li>
      </ul>
      <the-button-submit
        buttonText="保存"
        @click="saveHandle"
      />
    </article>
    <popup
      v-model="isShowAddressPicker"
      position="bottom"
    >
      <vant-area
        :area-list="areaList"
        @confirm="addressPickerConfirm"
        @cancel="isShowAddressPicker = false"
      />
    </popup>
  </base-layout>
</template>

<script lang="ts">
// vue
import {Vue, Component} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

// 组件
import BaseLayout from '@/layouts/base-layout.vue';
import TheButtonSubmit from '@/components/the-button-submit.vue';
import {Checkbox} from 'vant';
import areaList from '@/assets/js/area';
import {Toast, Popup, Area} from 'vant';

// http
import {httpReq} from '@/utils/http-req';
import {addressAddReq, addressUpdateReq} from '@/serves/user';

@Component({
  components: {
    BaseLayout,
    TheButtonSubmit,
    Checkbox,
    Popup,
    vantArea: Area,
  },
})
export default class LocationCreate extends Vue {
  @namespace('userModule').State('addressChecked')
  private addressChecked!: any;

  // 是否默认
  private isDefault: boolean = false;
  // 是否显示地址选择器
  private isShowAddressPicker: boolean = false;
  // 城市信息列表
  private areaList = areaList;
  // 收件人
  private addressee = '';
  // 联系电话
  private phone = '';
  // 省
  private province: string = '';
  // 市
  private city: string = '';
  // 区
  private district: string = '';
  // 街道
  private street: string = '';
  // id
  private id: string = '';

  // 拼接地址
  get getAddress() {
    return this.province.concat(this.city, this.district);
  }

  private mounted() {
    if (this.$route.query.edit === '1') {
      this.updateCheckedAddress();
    }
  }

  // 设置选中的地址信息
  private updateCheckedAddress() {
    if (this.addressChecked) {
      const {
        addressee,
        province,
        city,
        district,
        address,
        phone,
        isDefault,
        id,
      } = this.addressChecked;

      this.isDefault = isDefault === 1 ? true : false;
      this.addressee = addressee;
      this.phone = phone;
      this.province = province;
      this.city = city;
      this.district = district;
      this.street = address;
      this.id = id;
    } else {
      this.$router.push('/user/location-receive');
    }
  }

  // 地址选择器确认
  private addressPickerConfirm(value: any[]) {
    const [province, city, district] = value;
    this.province = province.name;
    this.city = city.name;
    this.district = district.name;
    this.isShowAddressPicker = false;
  }

  // 保存处理
  private saveHandle() {
    if (!this.addressee) {
      Toast('请输入收货人');
      return false;
    }

    const phoneRegExp = /^1[34578]\d{9}$/;

    if (!phoneRegExp.test(this.phone)) {
      Toast('请输入正确的手机号码');
      return false;
    }

    if (!(this.getAddress && this.street)) {
      Toast('请输入地址');
      return false;
    }

    if (this.$route.query.edit === '1') {
      this.updateAddress();
    } else {
      this.createAddress();
    }
  }

  // 创建地址
  private createAddress() {
    return new Promise((resolve, reject) => {
      const body = {
        addressee: this.addressee,
        province: this.province,
        city: this.city,
        district: this.district,
        address: this.street,
        phone: this.phone,
        isDefault: this.isDefault ? 1 : 0,
      };

      addressAddReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(addressAddReq);
      Toast.loading('保存中...');
      httpRes.then(data => {
        Toast.success('创建成功');
        setTimeout(() => {
          this.$router.back();
        }, 1000);
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }

  // 更新地址
  private updateAddress() {
    return new Promise((resolve, reject) => {
      const body = {
        addressee: this.addressee,
        province: this.province,
        city: this.city,
        district: this.district,
        address: this.street,
        phone: this.phone,
        isDefault: this.isDefault ? 1 : 0,
        id: this.id,
      };

      addressUpdateReq.requestInit.body = JSON.stringify(body);
      const httpRes = httpReq(addressUpdateReq);
      Toast.loading('修改中...');
      httpRes.then(data => {
        Toast.success('修改成功');
        setTimeout(() => {
          this.$router.back();
        }, 1000);
        resolve(data);
      }).catch(reason => {
        Toast(reason);
        reject(reason);
      });
    });
  }
}
</script>

<style lang="scss" scoped>
#location-create {
  width: 100%;

  & > ul {
    & > li {
      display: grid;
      align-content: start;
      align-items: center;
      grid-template-rows: 5rem;
      padding: 0 1.6rem;
      font-size: 1.8rem;
      color: #333333;
      background-color: #fff;
      border-bottom: 1px solid #f5f5f5;

      & > input:not([type="radio"]) {
        align-self: stretch;
        border: none;
      }

      &.district {
         grid-auto-flow: column;
         justify-content: space-between;
      }
    }
  }
}
</style>