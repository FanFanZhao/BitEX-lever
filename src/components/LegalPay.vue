<template>
  <div id="legal-pay">
    <div class="title">
      <span>请付款</span>
      <span>￥{{msg.deal_money}}</span>
    </div>
    <div class="info">
      <div>
        <span>交易单价：</span>
        <span>{{msg.price}}</span>
      </div>
      <div>
        <span>交易数量：</span>
        <span>{{msg.number}}{{msg.currency_name}}</span>
      </div>
      <div>
        <span>付款信息：</span>
        <span>{{msg.way_name}}</span>
      </div>
      <div>
        <span>银行账户：</span>
        <span>{{msg.hes_account}}</span>
      </div>
      <div>
        <span>真实姓名：</span>
        <span>{{msg.hes_realname}}</span>
      </div>
      <div>
        <span>联系方式：</span>
        <span>{{msg.seller_phone}}</span>
      </div>
      <div>
        <span>识别码：</span>
        <span style="color:red">{{msg.messy_code}}      (*转账时请务必备注此识别码)</span>
      </div>
      <div>
        <span>参考号：</span>
        <span>{{msg.id}}</span>
      </div>
      <div>
        <span>商家账户：</span>
        <router-link :to="{path:'/legalSeller',query:{sellerId:msg.seller_id}}" tag="span" style="color:#2E1B85">{{msg.seller_name}}</router-link>
      </div>
      <div class="btns">
        <div class="btn" @click="showCancel = true">取消订单</div>
        <!-- <div class="btn" @click="showConfirm = true">我已付款，点击确认</div> -->
        <div class="btn imgbtn">
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
    <div class="confirm-box" v-if="showConfirm">
      <div class="content">
        <div>付款确认</div>
        <div>请确认您已向卖家付款</div>
        <div>恶意点击将直接冻结账户</div>
        <div class="yes-no flex">
          <div @click="showConfirm = false">取消</div>
          <div @click="confirm">确认</div>
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
      token:'',
      showConfirm:false,
      showCancel:false,
      hasPay:false,
      id:'',
      src:''
    };
  },
  created() {
    var token = window.localStorage.getItem("token") || "";
      // this.id = this.$route.query.id;
    if (token) {
      this.token = token;
      this.id = this.$route.query.id;
      this.getData();
    }
  },
  methods: {
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
        if(res.data.type == 'ok'){
          setTimeout(() => {
            this.$router.push('/legalRecord')
          }, 1000);
          
        }
        
      }).then(() => {
        this.showCancel = false;
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
                that.showConfirm = true;
            }else{
              layer.msg('图片上传失败');
            }
					}
				}
			});
    },
    confirm(){
      this.$http({
        url:'api/user_legal_pay',
        method:'post',
        data:{id:this.id,pay_voucher:this.src},
        headers:{Authorization:this.token}
      }).then(res => {
        // console.log(res);
        layer.msg(res.data.message);
        if(res.data.type == 'ok'){
          setTimeout(() => {
            this.$router.push('/legalRecord')
          }, 1000);
        }
        
      }).then(() => {
        this.showConfirm = false;
      })
    }
  }
};
</script>

<style lang='scss'>
#legal-pay {
  width: 1200px;
  margin: 50px auto;
  > .title {
    background: #f8f8f8;
    margin-bottom: 20px;
    font-size: 20px;
    line-height: 60px;
    > span {
      padding: 0 30px;
    }
    > span:last-child {
      font-weight: 600;
    }
  }
  > .info {
    background: #f8f8f8;
    padding: 0 30px;
    line-height: 40px;
    >div{
      display: flex;
    }
    span:first-child{
      width:140px;
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
  .imgbtn{position: relative;}
  #file{position: absolute;top: 0;left: 0;width: 190px;height: 40px;opacity: 0;z-index: 99;cursor: pointer;}
}
</style>
