<template>
  <div class="trade">
    <div class="title_box">
      <div class="tabtitle fColor1 ft16curPer">
        <!-- <span :class="{active:show == true}">限价交易</span> -->
        <!-- <span :class="{active:show == false}" @click="changeType">市价交易</span> -->
      </div>
    </div>
    <!-- 限价交易 -->
    <div class="content clear" v-if="show">
      <div class="w50 fl first">
        <div class="ft14">
          <div class="available clear fColor1" v-if="address.length<=0">
            <span class="baseColor curPer" @click="goNext('login')">登录</span>
            或
            <span class="baseColor curPer" @click="goNext('register')">注册</span>
            开始交易
          </div>
          <div class="clear available" v-else>
            <span class="fl fColor1">可用 {{user_legal | tofixedFour}} {{legal_name}}</span>
            <!-- <span class="fr baseColor curPer" @click="goNext('account')">充币</span> -->
          </div>
          <!-- <div class="mt40 input-item clear">
                        <label>买入价</label>
                        <input type="number" v-model="buyInfo.buyPrice" @keydown.69.prevent >
                        <span>{{currency_name}}</span>
          </div>-->
          <div class="mt40 input-item clear">
            <label>倍数：</label>
            <select class="buy_multiple" v-model="buyInfo.buy_selected" @change="selectMuit('buy')">
              <option disabled value>请选择倍数</option>
              <option
                v-for="(item,index) in multiple"
                :key="index"
                :value="item.value"
              >{{item.value}}倍</option>
            </select>
          </div>
          <div class="mt40 input-item clear">
            <label>手数：</label>
            <div>
              <b
                v-for="item in shareList"
                :key="item.value"
                :class="['share',{'active':type ==item.value}]"
                @click="select(item.value,'buy')"
              >{{item.value}}手</b>
            </div>
          </div>
          <div class="lever-total fColor1">
            <p class="clearfix mt15">
              <span class="fl">合约市值</span>
              <span class="market-value fr">≈ {{totalPriceBuy || '0.0000'}} {{legal_name}}</span>
            </p>
            <p class="clearfix mt10">
              <span class="fl">保证金</span>
              <span class="bond fr">≈ {{bonsBuy || '0.0000'}} {{legal_name}}</span>
            </p>
            <p class="clearfix mt10">
              <span class="fl">交易服务费</span>
              <span class="transaction-fee fr">≈ {{trandeFreeBuy || '0.0000'}} {{legal_name}}</span>
            </p>
          </div>
          <div
            class="sell_btn curPer mt40 tc greenBack fColor1 ft16"
            @click="buyCoin"
          >买入（做多）{{currency_name}}</div>
        </div>
      </div>
      <div class="w50 fl second">
        <div class="ft14">
          <div class="available clear fColor1" v-if="address.length<=0">
            <span class="baseColor curPer" @click="goNext('login')">登录</span>
            或
            <span class="baseColor curPer" @click="goNext('register')">注册</span>
            开始交易
          </div>
          <div class="clear available" v-else>
            <!-- <span class="fl fColor1">可用 {{user_currency | tofixedFour}} {{legal_name}}</span> -->
            <!-- <span class="fr baseColor curPer" @click="goNext('account')">充币</span> -->
          </div>
          <!-- <div class="mt40 input-item clear">
                        <label>卖出价</label>
                        <input type="number" @keydown.69.prevent v-model="sellInfo.sellPrice">
                        <span>{{currency_name}}</span>
          </div>-->
          <div class="mt40 input-item clear">
            <label>倍数：</label>
            <select
              class="sell_multiple"
              v-model="sellInfo.sell_selected"
              @change="selectMuit('sell')"
            >
              <option disabled value>请选择倍数</option>
              <option
                v-for="(item,index) in multiple"
                :key="index"
                :value="item.value"
              >{{item.value}}倍</option>
            </select>
          </div>
          <div class="mt40 input-item clear">
            <label>手数：</label>
            <div>
              <b
                v-for="item in shareList"
                :key="item.value"
                :class="['share',{'actives':types == item.value}]"
                @click="select(item.value,'sell')"
              >{{item.value}}手</b>
            </div>

            <!-- <b :class="['share',{'actives':types =='3'}]" @click="select(3,'sell')">3手</b>
            <b :class="['share',{'actives':types =='5'}]" @click="select(5,'sell')">5手</b>
            <b :class="['share',{'actives':types =='10'}]" @click="select(10,'sell')">10手</b>-->
          </div>
          <div class="lever-total fColor1">
            <p class="clearfix mt15">
              <span class="fl">合约市值</span>
              <span class="market-value fr">≈ {{totalPrice || '0.0000'}} {{legal_name}}</span>
            </p>
            <p class="clearfix mt10">
              <span class="fl">保证金</span>
              <span class="bond fr">≈ {{bons || '0.0000'}} {{legal_name}}</span>
            </p>
            <p class="clearfix mt10">
              <span class="fl">交易服务费</span>
              <span class="transaction-fee fr">≈ {{trandeFree || '0.0000'}} {{legal_name}}</span>
            </p>
          </div>
          <div
            class="sell_btn curPer mt40 tc redBack fColor1 ft16"
            @click="sellCoin"
          >卖出（做空）{{currency_name}}</div>
        </div>
      </div>
    </div>
    <!-- 市价交易 -->
    <div class="content clear" v-if="showNone">
      <div class="w50 fl first">
        <div class="ft14">
          <div class="available clear fColor1" v-if="address.length<=0">
            <span class="baseColor curPer" @click="goNext('login')">登录</span>
            或
            <span class="baseColor curPer" @click="goNext('register')">注册</span>
            开始交易
          </div>
          <div class="clear available" v-else>
            <span class="fl fColor1">可用 {{user_currency}} {{currency_name}}</span>
            <!-- <span class="fr baseColor curPer" @click="goNext('account')">充币</span> -->
          </div>
          <div class="mt40 input-item clear">
            <label>买入价</label>
            <input type="number" value="以市场最低价买入" @keydown.69.prevent disabled>
            <span>{{currency_name}}</span>
          </div>
          <div class="mt40 input-item clear">
            <label>买入量</label>
            <input type="number" @keydown.69.prevent @keyup="numFilter($event)">
            <span>{{legal_name}}</span>
          </div>
          <div class="sell_btn curPer mt40 tc greenBack fColor1 ft16">买入（做多）{{currency_name}}</div>
        </div>
      </div>
      <div class="w50 fl second">
        <div class="ft14">
          <div class="available clear fColor1" v-if="address.length<=0">
            <span class="baseColor curPer" @click="goNext('login')">登录</span>
            或
            <span class="baseColor curPer" @click="goNext('register')">注册</span>
            开始交易
          </div>
          <div class="clear available" v-else>
            <span class="fl fColor1">可用 {{user_legal}} {{legal_name}}</span>
            <!-- <span class="fr baseColor curPer" @click="goNext('account')">充币</span> -->
          </div>
          <div class="mt40 input-item clear">
            <label>卖出价</label>
            <input type="number" value="以市场最优价格卖出" @keydown.69.prevent disabled>
            <span>{{currency_name}}</span>
          </div>
          <div class="mt40 input-item clear">
            <label>卖出量</label>
            <input type="number" @keydown.69.prevent @keyup="numFilter($event)">
            <span>{{legal_name}}</span>
          </div>
          <div class="sell_btn curPer mt40 tc redBack fColor1 ft16">卖出（做空）{{currency_name}}</div>
        </div>
      </div>
    </div>
    <!-- 买入卖出弹窗 -->
    <div class="comfirm-modal flex" v-show="comfirmShow">
      <div class="comfirm-modal-content">
        <div class="loss-modal-header">
          <h3>确认下单</h3>
          <p @click="closeMosal()">X</p>
        </div>
        <ul>
          <li class="flex">
            <p>{{currency_name}}/{{legal_name}}</p>
          </li>
          <li class="flex">
            <p>类型：</p>
            <p>{{buyType == '1' ? '做多' : '做空'}}</p>
          </li>
          <li class="flex">
            <p>手数：</p>
            <p>{{buyType == '1' ? type : types}}</p>
          </li>
          <li class="flex">
            <p>倍数：</p>
            <p>{{buyType == '1' ? buyInfo.buy_selected : sellInfo.sell_selected}}</p>
          </li>
          <li class="flex">
            <p>保证金：</p>
            <p>{{buyType == '1' ? bonsBuy : bons}}{{legal_name}}</p>
          </li>
          <li class="flex">
            <p>手续费：</p>
            <p>{{buyType == '1' ? trandeFreeBuy : trandeFree}}{{legal_name}}</p>
          </li>
        </ul>
        <div class="modal-btn">
          <button type="button" @click="closeMosal()">取消</button>
          <button type="button" @click="comfirm()">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "trade",
  data() {
    return {
      currency_name: "",
      currency_id: "",
      legal_name: "",
      legal_id: "",
      multiple: "",
      user_currency: "",
      user_legal: "",
      show: true,
      showNone: false,
      allBalance: 0,
      buyInfo: { buy_selected: "", buyNum: 0, url: "lever/submit" },
      sellInfo: { sell_selected: "", sellNum: 0, url: "lever/submit" },
      type: 1,
      types: 1,
      shares: 0,
      bons: "",
      totalPrice: "",
      trandeFree: "",
      bonsBuy: "",
      totalPriceBuy: "",
      trandeFreeBuy: "",
      lastPrice: "",
      buyType: "",
      comfirmShow: false,
      shareList: []
    };
  },
  created() {
    this.address = localStorage.getItem("token") || "";
  },
  filters: {
    tofixed: function(val) {
      val = Number(val);
      return val.toFixed(2);
    },
    tofixedFour: function(val) {
      val = Number(val);
      return val.toFixed(4);
    }
  },
  mounted() {
    var that = this;
    that.address = localStorage.getItem("token") || "";
    that.legal_id = localStorage.getItem("legal_id");
    that.currency_id = localStorage.getItem("currency_id");
    that.legal_name = localStorage.getItem("legal_name");
    that.currency_name = localStorage.getItem("currency_name");
    that.buy_sell(that.legal_id, that.currency_id);
    eventBus.$on("tocel", function(datas) {
      console.log(datas);
      if (datas) {
        that.buy_sell(that.legal_id, that.currency_id);
      }
    });
  },
  methods: {
    numFilter(ev) {
      //48-57 96-105 108
      // console.log(ev.keyCode)
    },
    changeType() {
      this.show = !this.show;
    },
    goNext(url) {
      this.$router.push({ name: url });
    },

    buyCoin() {
      var that = this;
      if (this.buyInfo.buy_selected == "") {
        layer.msg("请选择倍数");
        return;
      }
      that.comfirmShow = true;
      that.buyType = 1;
    },
    sellCoin() {
      var that = this;
      if (this.sellInfo.sell_selected == "") {
        layer.msg("请选择倍数");
        return;
      }
      that.comfirmShow = true;
      that.buyType = 2;
    },
    //买入、卖出记录
    buy_sell(legals_id, currencys_id) {
      this.$http({
        url: "/api/" + "lever/deal",
        method: "post",
        data: {
          legal_id: legals_id,
          currency_id: currencys_id
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          console.log(res);
          if (res.data.type == "ok") {
            this.multiple = res.data.message.multiple.muit;
            this.user_currency = res.data.message.all_levers;
            this.user_legal = res.data.message.user_lever;
            this.lastPrice = res.data.message.last_price;
            this.shareList = res.data.message.multiple.share;
            // console.log(res.data)
            this.buyInfo.buyPrice = 0;
            this.buyInfo.buyNum = 0;
          } else {
            // layer.msg(res.data.message)
          }
        })
        .catch(error => {
          // console.log(error)
        });
    },
    // 选择手数
    select(options, values) {
      let that = this;
      that.shares = options;
      if (values == "buy") {
        that.type = options;
      } else {
        that.types = options;
      }
      if (values == "sell" && that.sellInfo.sell_selected != "") {
        var i = layer.load();
        this.$http({
          url: "/api/" + "currency/quotation_new",
          method: "get",
          data: {},
          headers: { Authorization: localStorage.getItem("token") }
        })
          .then(res => {
            if (res.data.type == "ok") {
              var list = res.data.message[0].quotation;
              for (let i in list) {
                if (that.currency_id == list[i].currency_id) {
                  var spread = parseFloat(list[i].spread).toFixed(4);
                  var transactionFee = parseFloat(
                    list[i].lever_trade_fee
                  ).toFixed(4);
                  var bond = parseFloat(
                    localStorage.getItem("lastPrice")
                  ).toFixed(4);
                  var prices = parseFloat((bond * spread) / 100).toFixed(4);
                  var pricesTotal = 0;
                  var muitNum = 0;
                    pricesTotal = parseFloat(bond - prices).toFixed(4);
                    muitNum = parseFloat(that.sellInfo.sell_selected).toFixed(
                      4
                    );
                   var share = parseFloat(options).toFixed(4);
                    console.log(share);
                    console.log(muitNum);
                    var shareNum = parseFloat(list[i].lever_share_num).toFixed(
                      4
                    );
                    var totalPrice = parseFloat(
                      pricesTotal * share * shareNum
                    ).toFixed(4);
                    var bondsValue = parseFloat(
                      (totalPrice - 0) / (muitNum - 0)
                    ).toFixed(4);
                    var tradeFreeValue = parseFloat(
                      (totalPrice * transactionFee) / 100
                    ).toFixed(4);
                    that.totalPrice = parseFloat(bond * share).toFixed(4);
                    that.trandeFree = tradeFreeValue;
                    that.bons = bondsValue;
                }
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
          setTimeout(function(){
            layer.close(i)
          },1500)
      } else if (values == "buy" && that.buyInfo.buy_selected != "") {
        var i = layer.load();
        this.$http({
          url: "/api/" + "currency/quotation_new",
          method: "get",
          data: {},
          headers: { Authorization: localStorage.getItem("token") }
        })
          .then(res => {
            if (res.data.type == "ok") {
              var list = res.data.message[0].quotation;
              for (let i in list) {
                if (that.currency_id == list[i].currency_id) {
                  var spread = parseFloat(list[i].spread).toFixed(4);
                  var transactionFee = parseFloat(
                    list[i].lever_trade_fee
                  ).toFixed(4);
                  var bond = parseFloat(
                    localStorage.getItem("lastPrice")
                  ).toFixed(4);
                  var prices = parseFloat((bond * spread) / 100).toFixed(4);
                  var pricesTotal = 0;
                  var muitNum = 0;
                    pricesTotal = parseFloat(bond + prices).toFixed(4);
                    muitNum = parseFloat(that.buyInfo.buy_selected);
                   var share = parseFloat(options).toFixed(4);
                    console.log(share);
                    console.log(muitNum);
                    var shareNum = parseFloat(list[i].lever_share_num).toFixed(
                      4
                    );
                    var totalPrice = parseFloat(
                      pricesTotal * share * shareNum
                    ).toFixed(4);
                    var bondsValue = parseFloat(
                      (totalPrice - 0) / (muitNum - 0)
                    ).toFixed(4);
                    var tradeFreeValue = parseFloat(
                      (totalPrice * transactionFee) / 100
                    ).toFixed(4);
                    that.totalPriceBuy = (bond * share).toFixed(4);
                    that.trandeFreeBuy = tradeFreeValue;
                    that.bonsBuy = bondsValue;
                }
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
          setTimeout(function(){
            layer.close(i)
          },1500)
      }
    },
    // 选择倍数
    selectMuit(type) {
      let that = this;
      var i = layer.load();
      this.$http({
        url: "/api/" + "currency/quotation_new",
        method: "get",
        data: {},
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          if (res.data.type == "ok") {
            var list = res.data.message[0].quotation;
            for (let i in list) {
              if (that.currency_id == list[i].currency_id) {
                var spread = parseFloat(list[i].spread).toFixed(4);
                var transactionFee = parseFloat(
                  list[i].lever_trade_fee
                ).toFixed(4);
                var bond = parseFloat(
                  localStorage.getItem("lastPrice")
                ).toFixed(4);
                var prices = parseFloat((bond * spread) / 100).toFixed(4);
                var pricesTotal = 0;
                var muitNum = 0;
                var share = 0;
                if (type == "sell") {
                  pricesTotal = parseFloat(bond - prices).toFixed(4);
                  muitNum = parseFloat(that.sellInfo.sell_selected).toFixed(4);
                  share = parseFloat(that.types).toFixed(4);
                  var shareNum = parseFloat(list[i].lever_share_num).toFixed(4);
                  var totalPrice = parseFloat(
                    pricesTotal * share * shareNum
                  ).toFixed(4);
                  var bondsValue = parseFloat(
                    (totalPrice - 0) / (muitNum - 0)
                  ).toFixed(4);
                  var tradeFreeValue = parseFloat(
                    (totalPrice * transactionFee) / 100
                  ).toFixed(4);
                  console.log(shareNum);
                  console.log(muitNum);
                  console.log(share);
                  that.totalPrice = parseFloat(bond * share).toFixed(4);
                  that.trandeFree = tradeFreeValue;
                  that.bons = bondsValue;
                } else {
                  pricesTotal = parseFloat(bond + prices).toFixed(4);
                  muitNum = parseFloat(that.buyInfo.buy_selected);
                  share = parseFloat(that.type).toFixed(4);
                  var shareNum = parseFloat(list[i].lever_share_num).toFixed(4);
                  var totalPrice = parseFloat(
                    pricesTotal * share * shareNum
                  ).toFixed(4);
                  var bondsValue = parseFloat(
                    (totalPrice - 0) / (muitNum - 0)
                  ).toFixed(4);
                  var tradeFreeValue = parseFloat(
                    (totalPrice * transactionFee) / 100
                  ).toFixed(4);
                  that.totalPriceBuy = parseFloat(bond * share).toFixed(4);
                  that.trandeFreeBuy = tradeFreeValue;
                  that.bonsBuy = bondsValue;
                }
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
        setTimeout(function(){
            layer.close(i)
          },1500)
    },
    // 关闭买入卖出弹窗
    closeMosal() {
      let that = this;
      that.comfirmShow = false;
    },
    // 下单确认
    comfirm() {
      let that = this;
      let data;
      if (that.buyType == 2) {
        data = {
          legal_id: that.legal_id,
          currency_id: that.currency_id,
          multiple: that.sellInfo.sell_selected,
          share: that.types,
          type: 2
        };
      } else {
        data = {
          legal_id: that.legal_id,
          currency_id: that.currency_id,
          multiple: that.buyInfo.buy_selected,
          share: that.type,
          type: 1
        };
      }
      var i = layer.load();
      this.$http({
        url: "/api/" + that.sellInfo.url,
        method: "post",
        data: data,
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          console.log(res);
          layer.close(i);
          // layer.msg(res.data.message)
          if (res.data.type == "ok") {
            if (that.buyType == 2) {
              that.sellInfo.sellPrice = 0;
              that.sellInfo.sellNum = 0;
            } else {
              that.buyInfo.buyPrice = 0;
              that.buyInfo.buyNum = 0;
            }

            eventBus.$emit("buyTrade", "tradebuy");
            eventBus.$emit("tocel", "updata");
            eventBus.$emit("to_leverExchange", "leverExchange");
            // that.buy_sell(that.legal_id,that.currency_id)
            layer.msg(res.data.message);
            setTimeout(function() {
              that.$router.push({ name: "leverTransactions" });
            }, 500);
          } else {
            layer.msg(res.data.message);
            that.comfirmShow = false;
          }
        })
        .catch(error => {
          console.log(error);
          that.comfirmShow = false;
        });
    }
  },
  computed: {
    buyTotal() {
      return this.buyInfo.buy_selected * this.buyInfo.buyNum || 0;
    },
    sellTotal() {
      return this.sellInfo.sell_selected * this.sellInfo.sellNum || 0;
    }
  }
};
</script>

<style scoped>
.title_box {
  height: 48px;
  line-height: 48px;
  padding: 0 30px;
  background-color: #181b2a;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.tabtitle span {
  cursor: pointer;
}
.tabtitle span:not(:last-child) {
  margin-right: 40px;
}
.content .first {
  padding: 0 15px 0 25px;
}
.content .second {
  padding: 0 25px 0 15px;
}
.available {
  height: 48px;
  border-bottom: 1px solid #303b4b;
  line-height: 48px;
}
.input-item {
  position: relative;
  line-height: 40px;
}
.input-item label {
  width: 20%;
  float: left;
  font-size: 14px;
  color: #637085;
}
.input-item input {
  width: 80%;
  float: left;
  border: 1px solid #52688c;
  border-radius: 3px;
  height: 40px;
  text-indent: 15px;
  font-size: 16px;
  color: #cdd6e4;
  background-color: #262a42;
  line-height: 38px;
}
.input-item span {
  position: absolute;
  right: 15px;
  color: #637085;
  font-size: 16px;
}
.input-item select {
  width: 80%;
  background: #262a42;
  color: #cdd6e4;
  border: 1px solid #52688c;
  border-radius: 3px;
  height: 40px;
  text-indent: 10px;
  font-size: 16px;
}
.attion {
  height: 20px;
  line-height: 30px;
  font-size: 12px;
}
.sell_btn {
  width: 100%;
  height: 40px;
  border-radius: 3px;
  color: #cdd6e4;
  line-height: 40px;
}
.greenBack {
  background-color: #55a067;
}
.redBack {
  background-color: #cc4951;
}
input:disabled {
  color: #627085;
  cursor: not-allowed;
}
.share {
  display: inline-block;
  font-weight: normal;
  border: 1px solid #eee;
  border-radius: 2px;
  font-size: 14px;
  color: #fff;
  line-height: 1.2;
  width: 18.8%;
  text-align: center;
  padding: 5px 0;
  margin-right: 3.14px;
}
b.active {
  background-color: #02c289;
  border: 1px solid #02c289;
}
b.actives {
  background-color: #de5959;
  border: 1px solid #de5959;
}
.comfirm-modal {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  color: #c7cce6;
}
.comfirm-modal-content {
  width: 500px;
  background-color: #262a42;
  margin: 0 auto;
  border-radius: 5px;
}
.loss-modal-header {
  line-height: 40px;
  text-align: center;
  position: relative;
}
.loss-modal-header p {
  position: absolute;
  right: 10px;
  top: 0;
}
.comfirm-modal-content li {
  line-height: 40px;
  margin: 0 20px;
}
.modal-btn {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  font-size: 0;
  padding-top: 30px;
}
.modal-btn button {
  width: 50%;
  line-height: 50px;
  border: none;
  float: left;
  font-size: 14px;
  color: #fff;
  background: #9db5c7;
}
.modal-btn button:last-child {
  border-left: 1px solid #2e333c;
  background: #689cf1;
}
</style>

