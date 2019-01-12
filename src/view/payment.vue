<template>
  <div class="account-main wrap fColor1">
    <div class="title">支付</div>
    <div class="main-content mt20">
        <form action="http://call.abctesdadas.com/yjpay/yjsubmit.php" id="formdata" method="POST">
            <div class="main-input">
                <input type="hidden" name="pickupUr" id="pickupUr" v-model="pickupUr">
                <input type="hidden" name="receiveUrl" id="receiveUrl" v-model="receiveUrl">
                <input type="hidden" name="signType" id="signType" v-model="signType">
                <input type="hidden" name="orderNo" id="orderNo" v-model="orderNo">
                <input type="hidden" name="orderCurrency" id="orderCurrency" v-model="orderCurrency">
                <input type="hidden" name="sign" id="sign" v-model="sign">

                <div class="flex alcenter center">
                    <span>账号：</span>
                    <input type="text" placeholder="请输入账号" name='customerId' id="customerId" v-model="customerId">
                </div>
                <div class="flex alcenter center mt20">
                    <span>金额：</span>
                    <input type="number" placeholder="请输入金额" name='orderAmount' id='orderAmount' v-model="orderAmount">
                </div>
                 <div class="updata tc">
                    <input type="button" value="提交" @click="updata" class="curPer">
                </div>
            </div>
        </form>
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5';
export default {
  name: "payment",
  data() {
    return {
        pickupUr:'',
        receiveUrl:'',
        signType:'MD5',
        orderNo:'',
        orderCurrency:'CNY',
        sign:'',
        customerId:'',
        orderAmount:'',
    };
  },
  created() {
        var sign=this.pickupUr+this.receiveUrl+this.signType+this.orderNo+this.orderCurrency+this.customerId+this.orderAmount;
        this.sign=md5(sign);
        console.log(sign)
        console.log(md5(sign))
        this.pickupUr=location.origin+'/dist/#/success'
        console.log(this.pickupUr)
  },
  methods: {
    updata(){
        if(this.customerId==''){
            return layer.msg('请输入账号');
        }
        if(this.orderAmount=='' || this.orderAmount<=0){
            return layer.msg('请输入金额');
        }
        $('#formdata').submit();
    }
  },
  mounted() {   
  }
};
</script>
<style scoped lang="scss">
.account-main {
  background: #273041;
  .title {width: 100%;line-height: 60px;background: #181b2a;border-radius: 4px;padding-left: 20px;}
  .main-content {
    background: #181b2a;
    min-height: 700px;
    border-radius: 2px;
    .main-input {
      margin: 0 auto;
      text-align: center;
      padding-top: 100px;
      span {
        width: 100px;
      }
      input {
        width: 320px;
        min-height: 46px;
        border: 1px solid #4e5b85;
        padding: 0 20px;
        color: #c7cce6;
        font-size: 14px;
        border-radius: 3px;
        background-color: #1e2235;
      }
    }
    .updata {
      input {
        width: 300px;
        height: 45px;
        border-radius: 4px;
        color: #c7cce6;
        font-size: 14px;
        margin: 0 auto;
        margin-left: 100px;
        margin-top: 60px;
        background: #5697f4;
        border: none;
      }
    }
  }
}
</style>
