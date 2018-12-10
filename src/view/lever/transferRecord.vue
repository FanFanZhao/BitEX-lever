<template>
  <div id="lever-record">
    <div class="title">
      <span class="fl">USDT</span>
      <span class="fr" @click="$router.go(-1)">返回</span>
    </div>
    <div class="list">
      <div class="list-title flex">
        <span>类型</span>
        <span>数量</span>
        <span>时间</span>
      </div>
      <ul>
        <li v-for="(item,index) in log" :key="index">
          <span>{{item.type}}</span>
          <span>{{item.number || '0.00' | toFixeds}}</span>
          <span>{{item.add_time}}</span>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      log: [],
      page: 1
    }
  },
  created() {
    this.getLog();
  },
  filters: {
    toFixeds: function(value) {
      value = Number(value);
      return value.toFixed(2);
    }
  },
  methods: {
    getLog:function() {
      let that = this;
      var token = window.localStorage.getItem("token");
      this.$http({
        url: "/api/wallet/hzhistory",
        method: "post",
        headers: { Authorization: token },
        data: {
        }
      }).then(res => {
        console.log(res);
        if (res.data.type == "ok") {
          let msg = res.data.data;
          that.log = msg;
        }
      });
    }
  }
};
</script>

<style lang='scss'>
#lever-record {
  width: 1200px;
  margin: 0 auto;
  color: #c7cce6;
  .title {
    height: 60px;
    line-height: 60px;
    padding: 0 30px;
    margin: 20px 0;
    font-size: 20px;
    border-radius: 3px;
    background-color: #181b2a;
    span {
      cursor: pointer;
    }
  }
  .list {
    min-height: 900px;
    padding: 0 30px;
    background: #181b2a;
  }
  .list-title,
  li {
    display: flex;
    line-height: 40px;
    justify-content: space-between;
    span {
      flex: 1;
      text-align: center;
    }
  }
  li {
    border-top: 1px solid #202a4a;
  }
  .loadmore {
    text-align: center;
    padding: 20px;
    cursor: pointer;
  }
}
</style>
