<template>
    <div id="pay-opts">
        <div class="inp-item">
            <div>真实姓名</div>
            <input type="text" class="请输入真实姓名" v-model="name">
        </div>
        <div class="inp-item">
            <div>开户行名称</div>
            <input type="text" class="请输入开户行名称" v-model="bankName">
        </div>
        <div class="inp-item">
            <div>银行卡号</div>
            <input type="number" class="请输入银行卡号" v-model="bankNum">
        </div>
        <div class="inp-item">
            <div>支付宝账号</div>
            <input type="text" class="请输入支付宝账号" v-model="ali">
        </div>
        <div class="inp-item">
            <div>微信昵称</div>
            <input type="text" class="请输入微信昵称" v-model="weChatName">
        </div>
        <div class="inp-item">
            <div>微信账号</div>
            <input type="text" class="微信账号" v-model="weChatAccount">
        </div>
        <div class="btn bgRed" @click="add">
            确认
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      token: "",
      name: "",
      bankName: "",
      bankNum: "",
      ali: "",
      weChatAccount: "",
      weChatName: ""
    };
  },
  created() {
    this.token = window.localStorage.getItem("token") || "";
    if(this.token == ''){
      this.$router.push('/components/login');
    }
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$http({
        url: "/api/user/cash_info",
        method: "post",
        headers: { 'Authorization': this.token }
      }).then(res => {
        if ((res.data.type == "ok")) {
            if(res.data.message != null){
                let data = res.data.message;
                this.name = data.real_name;
                this.bankName = data.bank_name;
                this.bankNum = data.bank_account;
                this.ali = data.alipay_account;
                this.weChatAccount = data.wechat_account;
                this.weChatName = data.wechat_nickname;

            }

        }
      });
    },
    add() {
        if(this.name == ''){
            layer.mag('真实姓名必须填写');return;
        }
      this.$http({
        url: "/api/user/cash_save",
        method: "post",
        data: {
          real_name: this.name,
          bank_name: this.bankName,
          bank_account: this.bankNum,
          alipay_account: this.ali,
          wechat_nickname: this.weChatName,
          wechat_account: this.weChatAccount
        },
        headers: { 'Authorization': this.token }
      }).then(res => {
          layer.msg(res.data.message)
      })
    }
  }
};
</script>

<style lang='scss'>
#pay-opts {
  width: 600px;
  color: #c7cce6;
  > .inp-item {
    position: relative;
    margin-bottom: 20px;
    background: none;
    padding-left: 120px;
    height: 42px;
    > div {
      position: absolute;
      top: 0;
      left: 0;
      
      width: 120px;
      height: 40px;
      line-height: 40px;
      // text-align: center;
      
    }
    > input {
      display: block;
      padding: 0 20px;
      width: 100%;
      line-height: 40px;
      border: 1px solid #4e5b85;
      color: #c7cce6;
      background: none;
    }
  }
  .btn {
    margin: 30px 0 0 120px;
    width: 480px;
    line-height: 40px;
    text-align: center;
    background: #4e5b85;
    color: #fff;
    cursor: pointer;
  }
}
</style>
