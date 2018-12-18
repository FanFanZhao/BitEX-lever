<template>
  <div id="legal-seller" class="white">
    <div class="top flex bgf8">
      <div class="top-t flex bod_rc">
        <div class="logo ft18" v-if="info.name">{{(info.name).charAt(0)}}</div>
        <div>
          <div>{{info.name}}</div>
          <div>注册时间：{{info.create_time}}</div>
        </div>
      </div>
      <div class="top-b flex">
        <div>
          <div>{{info.total}}</div>
          <div>总成单</div>
        </div>
        <div>
          <div>{{info.thirtyDays}}</div>
          <div>30日成单</div>
        </div>
        <div>
          <div>{{info.done}}</div>
          <div>完成单</div>
        </div>
        <div>
          <div>100%</div>
          <div>完成率</div>
        </div>
      </div>
    </div>
    <div class="md flex bgf8">
      <div>
        <span>邮箱认证</span>
        <img v-if="info.prove_email == 1" src="../assets/images/success.png" alt="">
        <img v-else src="../assets/images/icon_error.png" alt="">
      </div>
      <div>
        <span>手机</span>
        <img v-if="info.prove_mobile == 1" src="../assets/images/success.png" alt="">
        <img v-else src="../assets/images/icon_error.png" alt="">
      </div>
      <div>
        <span>实名认证</span>
        <img v-if="info.prove_real == 1" src="../assets/images/success.png" alt="">
        <img v-else src="../assets/images/icon_error.png" alt="">
      </div>
      <div>
        <span>高级认证</span>
        <img v-if="info.prove_level == 1" src="../assets/images/success.png" alt="">
        <img v-else src="../assets/images/icon_error.png" alt="">
      </div>
    </div>
    <div class="list bgf8">
      <div class="tab">
        <span  :class="{'now':showWhich == 'sell'}" @click="showWhich = showWhich == 'sell'?'none':'sell'">在线出售</span>
        <span :class="{'now':showWhich == 'buy'}" @click="showWhich = showWhich == 'buy'?'none':'buy'">在线购买</span>
      </div>
      <div class="ul-head flex">
        <div>币种</div>
        <div>数量</div>
        <div>限额</div>
        <div>单价</div>
        <div>支付方式</div>
        <div>操作</div>
      </div>
      <ul :class="[showWhich+'-box']">
        <li v-for="(item,index) in info.lists.data" :key="index" :class="[item.type == 'buy'?'buy-item':'sell-item']" class="bod_bc">
          <div>{{item.currency_name}}</div>
          <div>{{item.surplus_number | toFixeds}}</div>
          <div>{{item.limitation.min | toFixeds}}-{{item.limitation.max | toFixeds}}</div>
          <div>{{item.price | toFixeds}}</div>
          <div>{{item.way_name}}</div>
          <div>
            <span v-if="item.type == 'buy'" @click="setDetail(item)">出售</span>
            <span v-else @click="setDetail(item)">购买</span>
          </div>
        </li>
      </ul>
      <div class="more" @click="getSellerInfo(true)">加载更多</div>
    </div>
    <div class="buy-sell-box" v-if="showDetail">
      <div class="content">
        <div class="close">
          <span class="fr" @click="close">X</span>
        </div>
        <div class="flex">
          <span>{{detail.type == 'buy'?'出售':'购买'}}</span><span>{{detail.currency_name}}</span>
        </div>
        <div class="flex">
          <span>单价：</span><span>{{detail.price | toFixeds}}</span>
        </div>
        <div class="flex">
          <span>限额：</span><span>{{detail.limitation.min | toFixeds}}-{{detail.limitation.max | toFixeds}}</span>
        </div>
        <div class="flex">
          <span>数量：</span><span>{{detail.surplus_number | toFixeds}}</span>
        </div>
        <div class="tab">
          <span :class="{'selected':detail.which == 'money'}" @click="detail.which = 'money',detail.money = '',totalPrice = '0.000'">CNY交易</span>
          <span :class="{'selected':detail.which == 'number'}" @click="detail.which = 'number', detail.money = '',totalPrice = '0.000'">{{detail.type == 'buy'?'卖出':'买入'}}数量</span>
        </div>
        <div class="inp" v-if="detail.which == 'money'">
          <input type="number" v-if="detail.type == 'buy'" placeholder="请输入欲出售法币总额" v-model="detail.money">
          <input type="number" v-else placeholder="请输入欲购买法币总额" v-model="detail.money">
          <span>CNY</span>
          <!-- <span class="all" @click="detail.money = detail.limitation.max">全部{{detail.type == 'buy'?'卖出':'买入'}}</span> -->
          <span class="all" @click="allData('money')">全部{{detail.type == 'buy'?'卖出':'买入'}}</span>
          
        </div>
        <div class="inp" v-if="detail.which == 'number'">
          <input type="number" v-if="detail.type == 'buy'" placeholder="请输入欲出售数量" v-model="detail.num">
          <input type="number" v-else placeholder="请输入欲购买数量" v-model="detail.num">
          <span>{{detail.currency_name}}</span>
          <!-- <span class="all" @click="detail.num = detail.surplus_number">全部{{detail.type == 'buy'?'卖出':'买入'}}</span> -->
          <span class="all" @click="allData('num')">全部{{detail.type == 'buy'?'卖出':'买入'}}</span>
        </div>
        <div v-if="detail.which == 'money'">
            <span>交易总额：</span>
            <span>￥{{detail.money || '0.000' | toFixeds}}</span>
        </div>
        <div v-if="detail.which == 'number'">
            <span>交易总额：</span>
            <span>￥{{detail.num * detail.price || '0.000' | toFixeds}}</span>
        </div>
        <div class="tip">请在24小时内联系商家付款，超出24小时将自动取消</div>
        <div class="btns flex">
          <div class="cancel" @click="cancel">
            <span ref="remainTime">{{times}}</span><span>秒后自动取消</span></div>
          <div class="ok" @click="buySell('buy')" v-if="detail.type == 'sell'">下单</div>
          <div class="ok" @click="buySell('sell')" v-if="detail.type == 'buy'">下单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: "",
      page: 1,
      sellerId: '',
      info: { lists: { data: [] } },
      showWhich: "none",
      showDetail: false,
      detail: { money: "", num: "" },
      timer: "",
      times:60,
      userBalance:'',
      allType:'',
      totalPrice:'0.000'

    };
  },
  filters: {
			toFixeds: function(value) {
				value = Number(value);
				return value.toFixed(3);
			}
		},
  created() {
    this.token = window.localStorage.getItem("token") || "";
    if (this.token) {
      this.sellerId = this.$route.query.sellerId;
      this.getSellerInfo();
    }
  },
  methods: {
    close(){
      this.showDetail=false;
      clearInterval(this.timer);
    },
    getSellerInfo(more) {
      this.showWhich = "none";
      if (!more) {
        this.page = 1;
      }
      let i = layer.load();
      this.$http({
        url: "/api/seller_info",
        params: {
          id: this.sellerId,
          page: this.page
        },
        headers: { Authorization: this.token }
      }).then(res => {
        layer.close(i);
        if (res.data.type == "ok") {
          var oldlist = this.info.lists.data;
          var newlist = res.data.message.lists.data;
          this.page += 1;

          if (more) {
            if (newlist.length) {
              this.info.lists.data = newlist.concat(oldlist);
            } else {
              layer.msg("没有更多数据");
            }
          } else {
            this.info = Object.assign({}, res.data.message);
          }
        }
      });
    },
    setDetail(item) {
      console.log(item);
      this.detail = Object.assign({ which: "money", money: "", num: "" }, item);
      this.showDetail = true;
      var time = 60;
      var that = this;
      this.$http({
        url: "/api/legal_deal_info",
        params: {
          id: item.id,
        },
        headers: { Authorization: that.token }
      }).then(res => {
        if (res.data.type == "ok") {
          console.log(res);
          that.userBalance = res.data.message.user_legal_balance;
          that.allType =res.data.message.type; 
        }
      });
      that.timer = setInterval(function() {
        time--;
        that.times = time;
        // that.$refs.remainTime.innerHTML = time;
        if (time == 0) {
          that.showDetail = false;
          clearInterval(that.timer);
        }
      }, 1000);
    },
    buySell() {
      // this.detail = Object.assign({which:'money'},item)
      // var value = this.detail.which == 'money'?detail.money:detail.num;
      var value = "";
      if (this.detail.which == "money") {
        value = this.detail.money;
        if (value == "") {
          return;
        } else if ((value -0 - this.detail.limitation.min)<0) {
          layer.msg("不能低于最低限额");
          return;
        } else if ((value -0 - this.detail.limitation.max) > 0) {
          layer.msg("不能超出最大限额");
          return;
        }
      } else {
        value = this.detail.num;
        if(value == ''){
          return;
        } else if(value>this.detail.surplus_number){
          layer.msg('不能超出最大数量');return;
        }
      }
      var i=layer.load();
      this.$http({
        url: "/api/do_legal_deal",
        method: "post",
        data: { means: this.detail.which, value: value, id: this.detail.id },
        headers:{Authorization:this.token}
      }).then(res => {
        this.showDetail = false;
        layer.close(i);
        console.log(res);
        if(res.data.type == 'ok'){
          var message = res.data.message;
          layer.msg(message.message)
          if(this.detail.type == 'sell'){
            setTimeout(function(){
              this.$router.push({path:'/legalPay',query:{id:msg.data.id}})
            },500)
          } else {
            setTimeout(function(){
              this.$router.push({path:'/components/payCannel',query:{id:msg.data.id}})
            },500)
          }
        }else{
          layer.msg(res.data.message)
        }
        
      })
    },
    cancel() {
      clearInterval(this.timer);
      this.showDetail = false;
    },
    // 全部
    allData(options){
      let that = this;
      if(that.allType == 'buy'){
        if(options == 'money'){
          that.detail.money = ((that.userBalance - 0) * (that.detail.price - 0) - 0).toFixed(3);
          that.totalPrice = that.detail.money;
        }else{
          that.detail.num = (that.userBalance - 0).toFixed(3);
          that.totalPrice = ((that.userBalance - 0) * (that.detail.price - 0) - 0).toFixed(3);
        }
      }else{
        if(options == 'money'){
          that.detail.money = (that.detail.limitation.max - 0).toFixed(3);
          that.totalPrice = that.detail.money;
        }else{
          that.detail.num = (that.detail.surplus_number - 0).toFixed(3);
          that.totalPrice = ((that.detail.surplus_number - 0) * (that.detail.price - 0) - 0).toFixed(3);
        }
      }
    }
  }
};
</script>

<style lang='scss'>
#legal-seller {
  margin: 30px auto 0;
  width: 1200px;
  // background: #f8f8f8;
  line-height: 30px;
  > .top {
    // background: #f8f8f8;
    line-height: 36px;
    padding: 16px 30px;
    > .top-t {
      align-items: center;
      padding-right: 30px;
      // border-right: 1px solid #ccc;
      margin-right: 30px;
      > .logo {
        margin-right: 20px;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        line-height: 50px;
        background: #7a98f7;
        text-align: center;
      }
    }
    > .top-b {
      > div {
        width: 100px;
        text-align: center;
      }
    }
  }
  > .md {
    // background: #f8f8f8;
    padding: 16px 30px;
    > div {
      margin-right: 50px;
      img {
        width: 16px;
        height: 16px;
        position: relative;
        top: 3px;
      }
    }
  }
  > .list {
    // background: #f8f8f8;
    margin-top: 20px;
    padding: 16px 30px;
    > .tab {
      margin: 16px 0;
      span {
        margin-right: 20px;
        cursor: pointer;
      }
      > .now {
        color: #7a98f7;
        font-weight: 600;
      }
    }
    > .ul-head {
      justify-content: space-between;
      > div {
        flex: 1;
        text-align: center;
      }
      > div:nth-child(3) {
        flex: 2;
      }
      > div:first-child {
        text-align: left;
      }
      > div:last-child {
        text-align: right;
      }
    }
    > ul {
      li {
        display: flex;
        justify-content: space-between;
        padding: 16px 0;
        // border-bottom: 1px solid #ddd;
        > div {
          flex: 1;
          text-align: center;
        }

        > div:nth-child(3) {
          flex: 2;
        }
        > div:first-child {
          text-align: left;
        }
        > div:last-child {
          // text-align: right;
          // display: flex;
          height: 30px;
          span {
            float: right;
            background: #7a98f7;
            padding: 0 16px;
            border-radius: 2px;
            color: #fff;
            cursor: pointer;
          }
        }
      }
    }
    > .buy-box > .sell-item,
    .sell-box > .buy-item {
      display: none;
    }
    .more {
      padding: 0 20px;
      text-align: center;
      cursor: pointer;
    }
  }
  > .buy-sell-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    > .content {
      margin: 100px auto 0;
      border-radius: 2px;
      width: 440px;
      padding: 20px 30px 26px 30px;
      background: #262a42;
      line-height: 30px;
      .close{
        height: 25px;
        line-height: 25px;
        cursor: pointer;
      }
      > div:first-child {
        font-weight: 600;
      }
      > .flex {
        // display: flex;
        span:first-child {
          width: 80px;
        }
      }
      > .tab {
        margin: 10px 0 20px;
        border-bottom: 1px solid #303b4b;
        span {
          margin-right: 20px;
        }
        cursor: pointer;
        > .selected {
          font-weight: bold;
          color: #7a98f7;
        }
      }
      > .inp {
        display: flex;
        border-radius: 2px;
        justify-content: space-between;
        border: 1px solid #303b4b;
        padding: 3px 16px;
        input{
          background: transparent;
          color: #fff;
        }
        span {
          padding-left: 10px;
          margin-left: 10px;
        }
        .all {
          border-left: 1px solid #303b4b;
          font-weight: 600;
          cursor: pointer;
        }
      }
      > .tip {
        font-size: 12px;
        margin-top: 10px 16px;
        color: #7a98f7;
      }
      > .btns {
        justify-content: space-between;

        > div {
          width: 46%;
          text-align: center;
          border-radius: 2px;
          line-height: 40px;
          cursor: pointer;
        }
        > .cancel {
          background: #ccc;
        }
        > .ok {
          background: #7a98f7;
          color: #fff;
        }
      }
    }
  }
}
</style>
