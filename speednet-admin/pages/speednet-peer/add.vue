<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
      <uni-forms-item name="region_id" label="所属区服" required>
        <uni-data-checkbox v-model="formData.region_id" collection="speednet-game-region" field="_id as value,region_name as text"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="peer_name" label="节点名称" required>
        <uni-easyinput placeholder="节点名称" v-model="formData.peer_name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="server" label="节点IP" required>
        <uni-easyinput placeholder="节点ip" v-model="formData.server"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="port" label="节点端口" required>
        <uni-easyinput placeholder="节点端口" type="number" v-model="formData.port"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="cipher" label="加密方式">
        <uni-easyinput placeholder="加密方式" v-model="formData.cipher"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="passwrod" label="密码">
        <uni-easyinput placeholder="密码" v-model="formData.passwrod" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="comment1" label="备注">
        <uni-easyinput placeholder="备注" v-model="formData.comment1"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="comment2" label="备注2">
        <uni-easyinput placeholder="备注2" v-model="formData.comment2"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="status" label="节点状态">
        <uni-data-checkbox v-model="formData.status" :localdata="formOptions.status_localdata"></uni-data-checkbox>
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
  import { validator } from '../../js_sdk/validator/speednet-peer.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'speednet-peer';

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
        "region_id": "",
        "peer_name": "",
        "server": "",
        "port": null,
        "cipher": "",
        "passwrod": "",
        "comment1": "",
        "comment2": "",
        "status": null
      }
      return {
        formData,
        formOptions: {
          "status_localdata": [
            {
              "value": 1,
              "text": "正常"
            },
            {
              "value": 2,
              "text": "异常"
            }
          ]
        },
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
