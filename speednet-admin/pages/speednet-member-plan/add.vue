<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
      <uni-forms-item name="hours" label="本计划小时数">
        <uni-easyinput placeholder="会员订阅计划的小时数" type="number" v-model="formData.hours"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="price" label="本计划的价格" required>
        <uni-easyinput placeholder="本计划的价格" type="number" v-model="formData.price"></uni-easyinput>
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
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/speednet-member-plan.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'speednet-member-plan';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
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
        "enable": null,
        "tag": "",
        "show_tag": null,
        "comment": ""
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
