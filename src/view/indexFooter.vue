<template>
    <footer>
          <div class="content flex">
            <dl>
              <dt>关于我们</dt>
              <!-- <router-link to="/c2c" tag="dd">c2c交易</router-link>
              <router-link to="/leverdealCenter" tag="dd">杠杆交易</router-link> -->
              <dd v-for="item in footFrist" @click="goDetail(item.id)">{{item.title}}</dd>
            </dl>
            <dl>
              <dt>用户支持</dt>
              <dd v-for="item in footSecond" @click="goDetail(item.id)">{{item.title}}</dd>
              <!-- <router-link to="/components/login" tag="dd">登录</router-link>
              <router-link to="/components/register" tag="dd">注册</router-link>
              <router-link to="/forgetPwd" tag="dd">找回密码</router-link> -->
            </dl>
            <dl>
              <dt>联系我们</dt>
              <dd>客服QQ：3044274988</dd>
              <dd>联系邮箱：dfhsijiang1258@gmail.com</dd>
            </dl>
          </div>
          <p>©2014-2018 BitEX.com,All Rights Reserved</p>
        </footer>
</template>
<script>
export default {
  name: "indexFooter",
  data() {
    return {
      footFrist:[],
      footSecond:[],
    };
  },
  created() {
  },
  mounted() {

    this.aboutUs();
    this.help();
  },
  methods: {
    // 公告详情
    goDetail(id) {
      var id = id;
      this.$router.push({
        name: "noticeDetail",
        query: { id: id }
      });
    },
    aboutUs(){
      var that = this;
      this.$http.post("/api/news/list",{"c_id":9}).then(res => {
        if (res.data.type == "ok") {
             console.log(res);
             var list = res.data.message.list;
             if (list.length > 2) {
            that.footFrist = list;
          } else {
            that.footFrist = list;
          }
        } else {
          // layer.msg(res.message);
        }
      });
    },
    help(){
      var that = this;
      this.$http.post("/api/news/list",{"c_id":10}).then(res => {
        if (res.data.type == "ok") {
             console.log(res);
             var list = res.data.message.list;
             if (list.length > 2) {
            that.footSecond = list;
          } else {
            that.footSecond = list;
          }
        } else {
          // layer.msg(res.message);
        }
      });
    }
  }
};
</script>


<style scoped lang='scss'>
footer{
  width: 100%;
  background: rgb(20,20,63);
  padding: 30px 0;
  text-align: center;
  .content{
    width: 600px;
    margin: 0 auto;
    justify-content: space-between;
    dl{
      
      dt{
        font-size: 16px;
        color: #fff;
        margin-bottom: 20px;
        text-align: left;
      }
      dd{
        font-size: 14px;
        color: #8b89c8;
        line-height: 24px;
        text-align: left;
        cursor: pointer;
        &:hover{
          color: #fff;
        }
      }
    }
  }
  p{
    margin-top: 20px;
    color: #fff;
    font-size: 13px;
  }
}
</style>


