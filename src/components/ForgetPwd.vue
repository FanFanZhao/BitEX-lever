<template>
<div class="forget-box">
    <indexHeader></indexHeader>
    <div class="contentBK">
        <div class="content-wrap">
            <div class="account">
                <div class="main" v-if="!showReset">
                    <p class="main_title">忘记密码</p>
                    <div class="register-input">
                        <span class="register-item">账号</span>
                        <input type="text" class="input-main input-content" maxlength="20" v-model="account_number" id="account">
                    </div>
                     <div class="register-input code-input" >
                        <span class="register-item">验证码</span>
                        <div class="code-box">
                            <input type="text" class="input-main input-content" maxlength="16" v-model="phoneCode" id="pwd" >
                        <button type="button" @click="setTime">获取验证码</button>
                        </div>
                    </div>
                    <div style="margin-top: 10px;">
                        <span class="register-item"></span>
                        <button class="register-button curPer" type="button" @click="check">确认</button>
                        
                    </div>
                   
                </div>
                <div class="main" v-if="showReset">
                    <div class="main_title">设置密码</div>
                    <div class="register-input">
                        <span class="register-item">请输入密码</span>
                        <input type="password" class="input-main input-content"  v-model="password" id="pwd">
                    </div>
                    <div class="register-input">
                        <span class="register-item">请再次输入密码</span>
                        <input type="password" class="input-main input-content"  v-model="re_password" id="repwd">
                    </div>
                    <button class="register-button curPer" type="button" @click="resetPass" style="margin-top:20px">确认</button>
                </div>
            </div>
        </div>
    </div>
    <indexFooter></indexFooter>
</div>

</template>

<script>
import indexHeader from "@/view/indexHeader";
import indexFooter from "@/view/indexFooter";
export default {
  components: { indexHeader, indexFooter },
  data() {
    return {
      isMb: true,
      account_number: "",
      phoneCode: "",
      showReset: false,
      password: "",
      re_password: ""
    };
  },
  created() {},
  methods: {
    sendCode(url) {
      this.$http({
        url: "/api/" + url,
        method: "post",
        data: {
          user_string: this.account_number,
          type: "forget"
        }
      }).then(res => {
        layer.msg(res.data.message);
      });
    },
    setTime(e) {
      if (e.target.disabled) {
        return;
      } else {
        var reg = /^1[345678]\d{9}$/;
        var url = "sms_send";
        var emreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (this.account_number == "") {
          layer.tips("请输入账号", "#account");
          return;
        } else if (reg.test(this.account_number)) {
        } else if (emreg.test(this.account_number)) {
          url = "sms_mail";
          this.isMb = false;
        } else {
          layer.tips("您输入的手机或邮箱账号不符合规则!", "#account");
          return;
        }

        this.sendCode(url);
        var time = 60;
        var timer = null;
        timer = setInterval(function() {
          e.target.innerHTML = time + "秒";
          e.target.disabled = true;
          if (time == 0) {
            clearInterval(timer);
            e.target.innerHTML = "验证码";
            e.target.disabled = false;
            return;
          }
          time--;
        }, 1000);
      }
    },
    check() {
      var reg = /^1[345678]\d{9}$/;
      var emreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      let user_string = this.account_number;
      var isMobile = reg.test(user_string);
      var isEmail = emreg.test(user_string);
      var url = "user/check_mobile";
      var data = {};

      if (user_string == "") {
        layer.tips("请输入账号!", "#account");
        return;
      } else if (this.phoneCode == "") {
        // console.log('请输入验证码');

        layer.tips("请输入验证码!", "#pwd");
        return;
      } else if (isEmail) {
        url = "user/check_email";
        data.email_code = this.phoneCode;
      } else if (isMobile) {
        url = "user/check_mobile";
        data.mobile_code = this.phoneCode;
      } else {
        layer.tips("您输入的邮箱或手机号不符合规则!", "#account");
        return;
      }

      this.$http({
        url: "/api/" + url,
        method: "post",
        data: data
      }).then(res => {
        layer.msg(res.data.message);
        if (res.data.type == "ok") {
          this.showReset = true;
          // window.location.href = "resetpass.html?user_string=" + names + "&" + "code=" + verify;
          // this.$router.push({path:'/resetPwd',params:{user_string:user_string,code:this.phoneCode}})
        }
      });
    },
    resetPass() {
      if (this.password == "") {
        layer.msg("请输入密码");
        return;
      } else if (this.re_password == "") {
        layer.msg("请再次输入密码");
        return;
      } else if (this.password !== this.re_password) {
        layer.msg("两次输入的密码不一致");
        return;
      } else {
        let data = {
          account: this.account_number,
          password: this.password,
          repassword: this.re_password,
          code: this.phoneCode
        };
        this.$http({
          url: "/api/user/forget",
          method: "post",
          data: data
        }).then(res => {
          //   console.log(res);
          layer.msg(res.data.message);
          if (res.data.type == "ok") {
            this.$router.push("/components/login");
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.content-wrap {
  background: url(../assets/images/bg_login.png) center bottom 316px repeat-x,
    -webkit-linear-gradient(top, #21263f, #262a42);
}
.account {
  width: 1200px;
  margin: 0 auto;
  padding-top: 93px;
  overflow: hidden;
  min-height: 880px;
}
.main {
  position: relative;
  padding: 0 0 60px 30px;
}
.main_title {
  font-size: 36px;
  color: #c7cce6;
}
.register-item {
  display: block;
  height: 22px;
  color: #61688a;
  font-size: 12px;
}
.register-input {
  position: relative;
  margin-top: 20px;
}
.input-box {
  position: relative;
  margin-top: 40px;
}
.input-main {
  width: 520px;
  min-height: 46px;
  border: 1px solid #4e5b85;
  padding: 0 20px;
  color: #c7cce6;
  font-size: 14px;
  border-radius: 3px;
  background-color: #1e2235;
}
.icon {
  width: 48px;
  height: 48px;
  line-height: 48px;
  border-right: 1px solid #52688c;
  position: absolute;
  top: 0;
}
.login-btn {
  width: 420px;
  margin-top: 40px;
  background: #5697f4;
  font-size: 16px;
  border-radius: 4px;
  color: #fff;
  line-height: 48px;
  cursor: pointer;
}
.noaccount {
  color: #fff;
}
.register-button {
  width: 200px;
  display: inline-block;
  line-height: 46px;
  background-color: #7a98f7;
  border-radius: 4px;
  color: #fff;
  border: none;
}
.have-account {
  font-size: 14px;
  display: inline-block;
  margin-left: 30px;
}
.right-tip {
  position: absolute;
  left: 620px;
  top: 70px;
  line-height: 24px;
  padding-right: 50px;
  margin-top: 10px;
  font-size: 14px;
  color: #61688a;
}
.code-box {
  width: 520px;
  border: 1px solid #4e5b85;
  background: #1e2235;
}
.code-box .input-main {
  width: 419px;
  border: none;
}
.code-box button {
  border: none;
  border-left: 1px solid #4e5b85;
  line-height: 44px;
  color: #7a98f7;
  background: #1e2235;
  width: 94px;
}
</style>
