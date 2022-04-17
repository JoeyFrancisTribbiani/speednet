<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="hours" label="本计划小时数">
        <uni-easyinput placeholder="会员订阅计划的小时数" type="number" v-model="formData.hours"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="price" label="本计划的价格" required>
        <uni-easyinput placeholder="本计划的价格" type="number" v-model="formData.price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="last_days" label="本计划有效期">
        <uni-easyinput placeholder="有效期" type="number" v-model="formData.last_days"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="enable" label="是否启用">
        <switch @change="binddata('enable', $event.detail.value)" :checked="formData.enable"></switch>
      </uni-forms-item>
      <uni-forms-item name="tag" label="优惠标签">
        <uni-easyinput placeholder="优惠标签" v-model="formData.tag"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="show_tag" label="是否显示标签">
        <switch @change="binddata('show_tag', $event.detail.value)" :checked="formData.show_tag"></switch>
      </uni-forms-item>
      <uni-forms-item name="comment" label="说明">
        <uni-easyinput placeholder="说明" v-model="formData.comment" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="plan_id" label="订阅计划" required>
        <uni-easyinput placeholder="订阅计划id" type="number" v-model="formData.plan_id"></uni-easyinput>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/speednet-member-plan.js';

  const db = uniCloud.database();
  const dbCollectionName = 'speednet-member-plan';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        result[key] = validator[key]
      }
    }
    return result
  }

  export default {
    data() {
      let formData = {
        "hours": null,
        "price": null,
        "last_days": null,
        "enable": null,
        "tag": "",
        "show_tag": null,
        "comment": "",
        "plan_id": null
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            icon: 'none',
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .uni-input-border {
    padding: 0 10px;
    height: 35px;

  }

  .uni-textarea-border {
    padding: 10px;
    height: 80px;
  }

  .uni-button-group {
    margin-top: 50px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
  }

  .uni-button {
    width: 184px;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    line-height: 1;
    margin: 0;
  }
</style>
