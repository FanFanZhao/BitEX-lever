<template>
    <footer>
          <div class="content flex">
            <dl>
              <dt>网站功能</dt>
              <router-link to="/c2c" tag="dd">c2c交易</router-link>
              <router-link to="/dealCenter" tag="dd">币币交易</router-link>
            </dl>
            <dl>
              <dt>用户帮助</dt>
              <router-link to="/components/login" tag="dd">登录</router-link>
              <router-link to="/components/register" tag="dd">注册</router-link>
              <router-link to="/forgetPwd" tag="dd">找回密码</router-link>
            </dl>
            <dl>
              <!-- <dt>app下载</dt>
              <dd></dd> -->
            </dl>
          </div>
        </footer>
</template>

<style scoped lang='scss'>
footer{
  background: #181b2a;
  padding: 30px 0;
  .content{
    width: 1500px;
    margin: 0 auto;
    justify-content: space-between;
    dl{
      
      dt{
        font-size: 16px;
        color: #fff;
        margin-bottom: 20px;
      }
      dd{
        font-size: 14px;
        color: #8b89c8;
        line-height: 24px;
        cursor: pointer;
        &:hover{
          color: #fff;
        }
      }
    }
    dl:last-child{
      dd{
        background: url('../assets/images/code.jpg') no-repeat;
        width: 100px;
        height: 100px;
        background-size: 100%;
      }
    }
  }
}
</style>


