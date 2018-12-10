<template>
  <div id="legal-pay-detail" class="bg-part">
    <div class="title bg-part">
      <span v-if="msg.is_sure == 0">未完成</span>
      <span v-if="msg.is_sure == 1">已完成</span>
      <span v-if="msg.is_sure == 2">已取消</span>
      <span v-if="msg.is_sure == 3">已付款</span>
      <div v-if="msg.is_sure == 0">请等待买家付款</div>
      <div v-if="msg.is_sure == 1">订单已完成</div>
      <div v-if="msg.is_sure == 2">订单已取消</div>
      <div v-if="msg.is_sure == 3">已付款，等待核实后确认</div>
     
    </div>
    <div class="info bg-part ft14">
      <div>
        <span>交易总额：</span>
        <span>{{msg.deal_money}}</span>
      </div>
      <div class="column" v-if="msg.is_seller==0">
        <div>
          <span>卖家:</span>
          <span v-if="msg.type=='buy'">{{user.account_number}}</span>
          <span v-else>{{msg.seller_name}}</span>
        </div>
        <div>
          <span>银行卡:</span>
          <span>{{user.bank_name}}:{{user.bank_account}}</span>
        </div>
        <div>
          <span>支付宝:</span>
          <span>{{user.alipay_account}}</span>
        </div>
        <div>
          <span>微信:</span>
          <span>{{user.wechat_account}}</span>
        </div>
        <div>
          <span>真实姓名:</span>
          <span>{{user.real_name}}</span>
        </div>
      </div>
      <div>
        <span>单价：</span>
        <span>{{msg.price}}</span>
      </div>
      <div>
        <span>数量：</span>
        <span>{{msg.number}}</span>
      </div>
      <div>
        <span>下单时间：</span>
        <span>{{msg.format_create_time}}</span>
      </div>
      <div>
        <span>联系方式：</span>
        <span>{{msg.is_seller==1?msg.buyer_phone:msg.seller_phone}}</span>
      </div>
      <div v-if="msg.pay_voucher"> 
        <span>支付凭证</span>
        <img :src="msg.pay_voucher" alt="" class="pay_voucher" @click="evimgs(msg.pay_voucher)">
      </div>
      <div>
        <span>识别码：</span>
        <span style="color:red">{{msg.messy_code}}      (*转账时请务必备注此识别码)</span>
      </div>
      <div>
        <span>参考号：</span>
        <span>{{msg.id}}</span>
      </div>
      <!-- <div>
        <span>商家账户：</span>
        <router-link :to="{path:'/legalSeller',query:{sellerId:msg.seller_id}}" tag="span" class="light_blue seller">{{msg.seller_name}}</router-link>
      </div> -->
      <div class="btns">
        <div class="btn" @click="showCancel = true" v-if="msg.is_sure == 0 && msg.type =='buy'">取消订单</div>
        <div class="btn" @click="showConfirm = true" v-if="(msg.is_sure == 3) && (msg.type =='sell')">确认已收款</div>
        <div class="btn imgbtn" v-if="(msg.is_sure==0) && (msg.type=='buy')">
          我已付款，上传付款凭证
          <input type="file" id="file" accept="image/*" @change="file" >
        </div>
      </div>
    </div>
    <div class="cancel-box" v-if="showCancel">
      <div class="content">
        <div>取消交易</div>
        <div>如您已向卖家付款请千万不要取消交易</div>
        <!-- <div>
          <input type="checkbox" v-model="hasPay" id="haspay">
          <label for="haspay">我还没有付款给对方</label>
        </div> -->
        <div class="yes-no flex">
          <div @click="showCancel = false">取消</div>
          <div @click="cancel">确认</div>
        </div>
      </div>
    </div>
    <!-- 确认收款 -->
    <div class="confirm-box" v-if="showConfirm">
      <div class="content">
        <div>收款确认</div>
        <div>请确认您已收到买家的打款</div>
        <div>恶意点击将直接冻结账户</div>
        <div class="yes-no flex">
          <div @click="showConfirm = false">取消</div>
          <div @click="confirm">确认</div>
        </div>
      </div>
    </div>

    <div class="confirm-box" v-if="showPay">
      <div class="content">
        <div>付款确认</div>
        <div>请确认您已向卖家付款</div>
        <div>恶意点击将直接冻结账户</div>
        <div class="yes-no flex">
          <div @click="showPay = false">取消</div>
          <div @click="confirmPay">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "",
      user:'',
      token:'',
      showConfirm:false,
      showCancel:false,
      hasPay:false,
      showPay:false,
      id:'',
      msg:{},
      src:''
    };
  },
  created() {
    var token = window.localStorage.getItem("token") || "";
      // this.id = this.$route.query.id;
    if (token) {
      this.token = token;
      this.id = this.$route.query.id || '';
      this.getMsg()
    }
  },
  methods: {
    getMsg(){
      var i = layer.load();
      this.$http({
        url:'/api/legal_deal',
        params:{id:this.id},
        headers:{Authorization:this.token}
      }).then(res => {
        layer.close(i);
        console.log(res);
        if(res.data.type == 'ok'){
          this.msg = res.data.message;
          this.user= res.data.message.user_cash_info;
        }
      })
    },
    getData() {
      var i = layer.load();
      this.$http({
        url: "/api/legal_deal",
        params: {
          id: this.id
        },
        headers: { Authorization: this.token }
      }).then(res => {
        layer.close(i);
        console.log(res);
        if (res.data.type == "ok") {
          this.msg = res.data.message;
        }
      });
    },
    cancel(){
      this.$http({
        url:'api/user_legal_pay_cancel',
        method:'post',
        data:{id:this.id},
        headers:{Authorization:this.token}
      }).then(res => {
        // console.log(res);
        layer.msg(res.data.message);
        
      }).then(() => {
        this.showCancel = false;
      })
    },
   // 卖家确认付款
    confirm(){
      this.$http({
        url:'api/legal_deal_sure',
        method:'post',
        data:{id:this.id},
        headers:{Authorization:this.token}
      }).then(res => {
        // console.log(res);
        layer.msg(res.data.message);
        location.reload();
      }).then(() => {
        this.showConfirm = false;
      })
    },
    file(){
      var that = this;
      var formData = new FormData();
			formData.append("file", $("#file")[0].files[0]);
      var i = layer.load();
			$.ajax({
				url:'api/upload',
				type: 'post',
				data: formData,
				processData: false,
				contentType: false,
				success: function (msg) {
          layer.close(i);
          console.log(msg)
					if(msg.type == 'ok'){
            that.src=msg.message;
            if(that.src){
                that.showPay = true;
            }else{
              layer.msg('图片上传失败');
            }
					}
				}
			});
    },
    // 买家确认付款
    confirmPay(){
      this.$http({
        url:'api/user_legal_pay',
        method:'post',
        data:{id:this.id,pay_voucher:this.src},
        headers:{Authorization:this.token}
      }).then(res => {
        // console.log(res);
        layer.msg(res.data.message);
        setTimeout(function(){
          location.reload();
        },2000)
        
      }).then(() => {
        this.showPay = false;
      })
    },
    evimgs(src){
      console.log(src)
      return layer.open({
        type: 1 //Page层类型
        ,area: ['375px', '500px']
        ,title: ''
        ,shade: 0.6 //遮罩透明度
        ,anim: 1 //0-6的动画形式，-1不开启
        ,content: "<img src='"+src+"' alt='' class='openimg'>"
        ,btn: ['关闭'],
         yes: function(index){
            layer.close(index);
        }

      });   
    }
  }
};
</script>

<style lang='scss'>
#legal-pay-detail {
  width: 1200px;
  margin: 50px auto;
  > .title {
    // background: #f8f8f8;
    margin-bottom: 20px;
    padding: 0  0 20px 30px;
    span{
      font-size: 20px;
      line-height: 50px;
      font-weight: bold;
    }
    div{
      font-size: 12px;
    }
  }
  > .info {
    // background: #f8f8f8;
    padding: 0 30px;
    line-height: 40px;
    >div{
      display: flex;
    }
    span:first-child{
      width:140px;
    }
    .column{
      div{
        display: flex;
        span:first-child{
          width:140px;
        }
      }
    }
    >.btns{
      padding: 20px 0;
      cursor: pointer;
      >div{
        color: #fff;
        border-radius: 2px;
        padding: 0 16px;
        background: #2E1B85;
        margin-right: 30px;
        font-size: 14px;
      }
      >div:first-child{
        background: #ccc;
        color: #333;
      }
    }
  }
  >.cancel-box,>.confirm-box{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.7);
    >.content{
      margin: 200px auto 0;
      border-radius: 2px;
      width: 360px;
      background: #fff;
      line-height: 40px;
      text-align: center;
      >div:first-child{
        font-weight: 600;
      }
      >.flex{
        margin-top: 10px;
        border-top: 1px solid #ccc;
        cursor: pointer;
        div{
          width: 50%;
        }
        >div:first-child{
          border-right: 1px solid #ccc;
        }
      }
    }
  }
  .seller{
    cursor: pointer;
  }
  .pay_voucher{
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
  .openimg{display: block;margin: 0 auto;max-width: 100%;}
  .imgbtn{position: relative;}
  #file{position: absolute;top: 0;left: 0;width: 190px;height: 40px;opacity: 0;z-index: 99;cursor: pointer;}
</style>
