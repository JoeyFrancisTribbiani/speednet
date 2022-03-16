<template>
  <view class="container">
    <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options" collection="speednet-game,speednet-game-region" field="game_name,processes,picture,regions{region_name as text},platform,status" :where="queryWhere" :getone="true" :manual="true">
      <view v-if="error">{{error.message}}</view>
      <view v-else-if="loading">
        <uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
      </view>
      <view v-else-if="data">
        <view>
          <text>游戏名称</text>
          <text>{{data.game_name}}</text>
        </view>
        <view>
          <text>进程名（多个逗号隔开）</text>
          <text>{{data.processes}}</text>
        </view>
        <view>
          <text>游戏封面</text>
          <uni-file-picker v-if="data.picture && data.picture.fileType == 'image'" :value="data.picture" :file-mediatype="data.picture && data.picture.fileType" return-type="object" readonly></uni-file-picker>
          <uni-link v-else-if="data.picture" :href="data.picture.url" :text="data.picture.url"></uni-link>
          <text v-else></text>
        </view>
        <view>
          <text>区服列表</text>
          <text>{{data.regions && data.regions[0] && data.regions[0].region_name}}</text>
        </view>
        <view>
          <text>游戏平台</text>
          <text>{{options.platform_valuetotext[data.platform]}}</text>
        </view>
        <view>
          <text>上架状态</text>
          <text>{{options.status_valuetotext[data.status]}}</text>
        </view>
      </view>
    </unicloud-db>
    <view class="btns">
      <button type="primary" @click="handleUpdate">修改</button>
      <button type="warn" class="btn-delete" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script>
  // 由schema2code生成，包含校验规则和enum静态数据
  import { enumConverter } from '../../js_sdk/validator/speednet-game.js';

  export default {
    data() {
      return {
        queryWhere: '',
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        },
        options: {
          // 将scheme enum 属性静态数据中的value转成text
          ...enumConverter
        }
      }
    },
    onLoad(e) {
      this._id = e.id
    },
    onReady() {
      if (this._id) {
        this.queryWhere = '_id=="' + this._id + '"'
      }
    },
    methods: {
      handleUpdate() {
        // 打开修改页面
        uni.navigateTo({
          url: './edit?id=' + this._id,
          events: {
            // 监听修改页面成功修改数据后, 刷新当前页面数据
            refreshData: () => {
              this.$refs.udb.loadData({
                clear: true
              })
            }
          }
        })
      },
      handleDelete() {
        this.$refs.udb.remove(this._id, {
          success: (res) => {
            // 删除数据成功后跳转到list页面
            uni.navigateTo({
              url: './list'
            })
          }
        })
      }
    }
  }
</script>

<style>
  .container {
    padding: 10px;
  }

  .btns {
    margin-top: 10px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
  }

  .btns button {
    flex: 1;
  }

  .btn-delete {
    margin-left: 10px;
  }
</style>
