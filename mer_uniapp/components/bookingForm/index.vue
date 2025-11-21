<template>
  <view class="card booking-form">
    <view class="form-list">
      <!-- 预约方式 -->
      <view class="form-item">
        <text class="label">预约方式</text>
        <picker class="picker-trigger" @change="handleSelectChange" :value="localForm.serviceTypeIndex" :range="serviceTypeRange">
          <view class="picker acea-row row-between-wrapper">
            <text class="value">{{ serviceTypeRange[localForm.serviceTypeIndex] }}</text>
            <text class="iconfont icon-ic_rightarrow"></text>
          </view>
        </picker>
      </view>

      <!-- 预约时间 -->
      <view class="form-item">
        <text class="label">预约时间</text>
        <uni-datetime-picker v-model="localForm.reservationDatetime" type="datetime" :clear-icon="false">
          <view class="picker acea-row row-between-wrapper">
            <text class="value" :class="{ placeholder: !localForm.reservationDatetime }">{{ localForm.reservationDatetime || '请选择' }}</text>
            <text class="iconfont icon-ic_rightarrow"></text>
          </view>
        </uni-datetime-picker>
      </view>

      <!-- 联系人 -->
      <view class="form-item">
        <text class="label">联系人</text>
        <input class="input" v-model.trim="localForm.userName" :disabled="readonly" placeholder="请输入" placeholder-style="color:#cdcdcd;" maxlength="20" />
      </view>

      <!-- 联系电话 -->
      <view class="form-item">
        <text class="label">联系电话</text>
        <input class="input" v-model.trim="localForm.userPhone" :disabled="readonly" type="number" placeholder="请输入" placeholder-style="color:#cdcdcd;" maxlength="11" />
      </view>

      <!-- 详细地址 -->
      <view v-show="workOrderNoInfo.serviceType === 1" class="form-item">
        <text class="label">上门地址</text>
        <input class="input" v-model.trim="localForm.userAddress" :disabled="readonly" placeholder="请输入详细地址" placeholder-style="color:#cdcdcd;" maxlength="100" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BookingForm',
  props: {
    value: {
      type: Object,
      default: () => ({
        serviceTypeIndex: 0,
        reservationDatetime: '',
        userName: '',
        userPhone: '',
        userAddress: '',
        addressInfo: []
      })
    },
    serviceTypeRange: {
      type: Array,
      default: () => ['上门服务', '到店服务']
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue','input'],
  data() {
    return {
      localForm: JSON.parse(JSON.stringify(this.modelOrValue() || {})),
      display: false
    }
  },
  computed: {
    addressText() {
      return (this.localForm.addressInfo || []).map(v => v.regionName).join('/')
    }
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.localForm = JSON.parse(JSON.stringify(this.modelOrValue() || {}))
      }
    },
    localForm: {
      deep: true,
      handler(n) {
        const clone = JSON.parse(JSON.stringify(n))
        this.$emit('update:modelValue', clone)
        this.$emit('input', clone)
      }
    }
  },
  methods: {
    modelOrValue() {
      // 优先使用 modelValue（Vue3），fallback 到 value（Vue2）
      return (this.modelValue && Object.keys(this.modelValue || {}).length)
        ? this.modelValue
        : this.value
    },
    handleSelectChange(e) {
      this.localForm.serviceTypeIndex = Number(e.detail.value)
    },
  }
}
</script>

<style scoped lang="scss">
.booking-form {
  padding: 16rpx 24rpx;

  .form-list {
    background: #fff;
    border-radius: 24rpx;
  }

  .form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 92rpx;
    padding: 20rpx 0;
    border-bottom: 1px solid #F5F5F5;

    &:last-child { border-bottom: none; }
    &.disabled { opacity: 0.7; }

    .label { font-size: 28rpx; color: #333; }

    .picker, .input {
      flex: 1;
      text-align: right;
      margin-left: 24rpx;
      font-size: 26rpx;
      color: #333;
    }

    .value.placeholder { color: #cdcdcd; }
  }
}
</style>

