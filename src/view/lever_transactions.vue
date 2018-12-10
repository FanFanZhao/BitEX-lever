<template>
  <div class="wrap">
    <div class="lever-header fColor1 mb15">风险率：{{riskRate}}%</div>
    <div class="total-pro fColor1 clearfix">
      <p class="fl">
        持仓总盈亏：
        <span :class="['red','flex1',{'green':totalPro > 0}]">{{totalPro | tofixedFour}}</span>
      </p>
      <button class="fr" type="button" @click="stopTotal()">一键平仓</button>
    </div>
    <ul class="list_head ft14">
      <li class="flex">
        <span class="width2">类型</span>
        <span class="width1">开仓价</span>
        <span class="width1">当前价</span>
        <span class="width1">保证金</span>
        <span class="width1">止盈价</span>
        <span class="width1">止损价</span>
        <span class="width2">开仓时间</span>
        <span class="width1">盈亏</span>
        <span class="width3">操作</span>
      </li>
    </ul>
    <ul class="list_content fColor1 ft12">
      <li v-for="(item,index) in list_content" :key="index" class="flex alcenter">
        <span class="width2">{{item.type == 1? '买入':'卖出'}} {{item.symbol}} x{{item.share}}</span>
        <span class="width1">{{item.price || '0.00' | tofixedFour}}</span>
        <span class="width1">{{item.update_price || '0.00' | tofixedFour}}</span>
        <span class="width1">{{item.caution_money || '0.00' | tofixedFour}}</span>
        <span class="width1">{{item.target_profit_price || '0.00' | tofixedFour}}</span>
        <span class="width1">{{item.stop_loss_price || '0.00' | tofixedFour}}</span>
        <span class="width2">{{item.time}}</span>
        <span
          :class="['red','width1',{'green':item.profits > 0}]"
        >{{item.profits || '0.00' | tofixedFour}}</span>
        <div class="width3">
          <span class="stop-btn" @click="stopLoss(item.id)">设置止盈止损</span>
          <span @click="pingcang(item.id)">平仓</span>
        </div>
      </li>
    </ul>
    <div class="mores" @click="load_more">
      <img v-if="list_content.length == 0" src="../assets/images/nodata.png" alt>
      <span>{{more}}</span>
    </div>

    <!-- 止盈止损弹窗 -->
    <div class="loss-modal flex" v-show="modalShow">
      <div class="content">
        <div class="loss-modal-header">
          <h3>设置止盈止损</h3>
          <p @click="closeMosal()">X</p>
        </div>
        <div class="loss-madal-content">
          <div class="flex">
            <span>止盈价格：</span>
            <p>
              <span @click="reduce(1)">-</span>
              <input type="text" v-model="targetProfit" @input="inputValue(1)">
              <span @click="add(1)">+</span>
            </p>
          </div>
          <p class="modal-text">预期盈利：{{modalProfit}}</p>
          <div class="flex">
            <span>止损价格：</span>
            <p>
              <span @click="reduce(2)">-</span>
              <input type="text" v-model="stopLose" @input="inputValue(2)">
              <span @click="add(2)">+</span>
            </p>
          </div>
          <p class="modal-text">预期亏损：{{modalStop}}</p>
        </div>
        <div class="modal-btn">
          <button type="button" @click="closeMosal()">取消</button>
          <button type="button" @click="comfirm()">确认</button>
        </div>
      </div>
    </div>
    <!-- 一键平仓弹窗 -->
    <div class="loss-modal flex" v-show="stopModal">
      <div class="content">
        <div class="loss-modal-header">
          <h5>确认平仓</h5>
          <p @click="closeStopModal()">X</p>
        </div>
        <div class="stopModal">
          <span :class="['stopall',{'alls':selectType == 'all'}]" @click="selectStop('all')">全部平仓</span>
          <span :class="['stopbuy',{'buys':selectType == 'buy'}]" @click="selectStop('buy')">只平多单</span>
          <span
            :class="['stopsell',{'sells':selectType == 'sell'}]"
            @click="selectStop('sell')"
          >只平空单</span>
        </div>
        <div class="stop-modal-btns">
          <button type="button" @click="closeStopModal()">取消</button>
          <button type="button" @click="comfirmModal()">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      legal_id: "",
      currency_id: "",
      list_content: [],
      page: 1,
      more: "加载更多",
      modalShow: false,
      targetProfit: "",
      stopLose: "",
      modalProfit: "",
      modalStop: "",
      modalId: "",
      presentPrice: "",
      riskRate: "",
      totalPro: "",
      stopModal: false,
      selectType: "all"
    };
  },
  created() {
    let that = this;
    this.legal_id = localStorage.getItem("legal_id");
    this.currency_id = localStorage.getItem("currency_id");
    this.init();
    setInterval(function() {
      that.loads();
    }, 6000);
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
  methods: {
    init() {
      this.more = "加载中...";
      this.$http({
        url: "/api/" + "lever/dealall",
        method: "post",
        data: {
          legal_id: this.legal_id,
          currency_id: this.currency_id,
          page: this.page
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          console.log(res);
          if (res.data.type == "ok") {
            this.more = "加载更多";
            this.list_content = this.list_content.concat(
              res.data.message.order.data
            );
            this.riskRate = res.data.message.hazard_rate;
            this.totalPro = res.data.message.profits_total;
            if (res.data.message.order.data.length == 0) {
              this.more = "没有更多了...";
            }
            if (res.data.message.order.data.length == 0 && this.page == 1) {
              this.more = "暂无数据";
            }
          } else {
            layer.msg(res.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 轮询
    loads() {
      let that = this;
      this.$http({
        url: "/api/" + "lever/dealall",
        method: "post",
        data: {
          legal_id: this.legal_id,
          currency_id: this.currency_id,
          page: 1
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          if (res.data.type == "ok") {
            let datas = res.data.message.order.data;
            that.riskRate = res.data.message.hazard_rate;
            that.totalPro = res.data.message.profits_total;
            if (datas.length > 0) {
              for (let i in datas) {
                that.list_content[i].profits = datas[i].profits;
                that.list_content[i].update_price = datas[i].update_price;
                that.list_content[i].target_profit_price =
                  datas[i].target_profit_price;
                that.list_content[i].stop_loss_price = datas[i].stop_loss_price;
              }
              console.log(that.list_content);
            } else {
              that.more = "暂无数据";
            }
          } else {
            layer.msg(res.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    pingcang(id) {
      this.$http({
        url: "/api/" + "lever/close",
        method: "post",
        data: {
          id: id
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          if (res.data.type == "ok") {
            layer.msg(res.data.message);
            location.reload();
          } else {
            layer.msg(res.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    load_more() {
      this.page++;
      this.init();
    },
    // 设置止盈止损
    stopLoss(ids) {
      let that = this;
      that.modalShow = true;
      for (let i in that.list_content) {
        if (that.list_content[i].id == ids) {
          that.modalId = that.list_content[i].id;
          that.presentPrice = parseFloat(that.list_content[i].price).toFixed(2);
          if (that.list_content[i].target_profit_price > 0) {
            that.targetProfit = parseFloat(
              that.list_content[i].target_profit_price
            ).toFixed(2);
          } else {
            that.targetProfit = that.presentPrice;
          }
          if (that.list_content[i].stop_loss_price > 0) {
            that.stopLose = parseFloat(
              that.list_content[i].stop_loss_price
            ).toFixed(2);
          } else {
            that.stopLose = that.presentPrice;
          }

          if (that.list_content[i].type == 1) {
            that.modalProfit = (
              that.targetProfit - parseFloat(that.list_content[i].price)
            ).toFixed(2);
            that.modalStop = (
              parseFloat(that.list_content[i].price).toFixed(2) - that.stopLose
            ).toFixed(2);
          } else {
            that.modalProfit = (
              parseFloat(that.list_content[i].price).toFixed(2) -
              that.targetProfit
            ).toFixed(2);
            that.modalStop = (
              that.stopLose - parseFloat(that.list_content[i].price)
            ).toFixed(2);
          }
        }
      }
    },
    // 加
    add(type) {
      let that = this;
      if (type == 1) {
        that.targetProfit = (parseFloat(that.targetProfit) + 0.01).toFixed(2);
        that.modalProfit = (parseFloat(that.modalProfit) + 0.01).toFixed(2);
      } else {
        that.stopLose = (parseFloat(that.stopLose) + 0.01).toFixed(2);
        that.modalStop = (parseFloat(that.modalStop) + 0.01).toFixed(2);
      }
    },
    // 减
    reduce(type) {
      let that = this;
      if (type == 1) {
        if (that.targetProfit > 0) {
          that.targetProfit = (parseFloat(that.targetProfit) - 0.01).toFixed(2);
          that.modalProfit = (parseFloat(that.modalProfit) - 0.01).toFixed(2);
        } else {
          layer.msg("设置的值必须大于0");
        }
      } else {
        if (that.stopLose > 0) {
          that.stopLose = (parseFloat(that.stopLose) - 0.01).toFixed(2);
          that.modalStop = (parseFloat(that.modalStop) - 0.01).toFixed(2);
        } else {
          layer.msg("设置的值必须大于0");
        }
      }
    },
    // 输入框输入
    inputValue(type) {
      let that = this;
      if (type == 1) {
        let inputModal = (
          parseFloat(that.targetProfit) - parseFloat(that.presentPrice)
        ).toFixed(2);
        if (inputModal > 0) {
          that.modalProfit = inputModal;
        } else {
          that.modalProfit = 0.0;
        }
      } else {
        let inputModal = (
          parseFloat(that.presentPrice) - parseFloat(that.stopLose)
        ).toFixed(2);
        if (inputModal > 0) {
          that.modalStop = inputModal;
        } else {
          that.modalStop = 0.0;
        }
      }
    },
    // 关闭弹窗
    closeMosal() {
      let that = this;
      that.modalShow = false;
    },
    // 确认设置
    comfirm() {
      let that = this;
      this.$http({
        url: "/api/" + "lever/setstop",
        method: "post",
        data: {
          id: that.modalId,
          target_profit_price: that.targetProfit,
          stop_loss_price: that.stopLose
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          if (res.data.type == "ok") {
            that.modalShow = false;
            layer.msg(res.data.message);
            for (let i in that.list_content) {
              if (that.modalId == that.list_content[i].id) {
                that.list_content[i].target_profit_price = that.targetProfit;
                that.list_content[i].stop_loss_price = that.stopLose;
              }
            }
          } else {
            layer.msg(res.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 一键平仓
    stopTotal() {
      let that = this;
      that.stopModal = true;
    },
    // 关闭一键平仓弹窗
    closeStopModal() {
      let that = this;
      that.stopModal = false;
    },
    // 选择平仓类型
    selectStop(types) {
      let that = this;
      that.selectType = types;
    },
    comfirmModal() {
      let that = this;
      console.log(that.selectType);
      let num = 0;
      if (that.selectType == "all") {
        num = 0;
      } else if (that.selectType == "buy") {
        num = 1;
      } else {
        num = 2;
      }
      this.$http({
        url: "/api/" + "lever/batch_close",
        method: "post",
        data: {
          type: num
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          if (res.data.type == "ok") {
            that.stopModal = false;
            layer.msg(res.data.message);
            that.list_content = [];
            that.init();
          } else {
            that.stopModal = false;
            layer.msg(res.data.message);
          }
        })
        .catch(error => {
          that.stopModal = false;
          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.wrap {
  min-height: 500px;
  background: #181b2a;
  width: 97%;
  margin: 30px auto;
  padding: 30px;
}
ul li {
  padding: 8px 0;
}
ul li span {
  display: inline-block;
}
ul li div {
  display: inline-block;
}
ul li div span {
  border-radius: 3px;
  color: white;
  background-color: #638bd4;
  cursor: pointer;
  min-height: 33px;
  min-width: 80px;
  font-size: 14px;
  border: none;
  padding: 0 5px;
  line-height: 33px;
  text-align: center;
}
.list_head {
  color: #637085;
  border-bottom: 1px solid #2e333c;
}
.red {
  color: #cc4951;
  cursor: pointer;
}
.green {
  color: #0d8551;
}
.stop-btn {
  margin-right: 10px;
}
.mores {
  color: #999;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  text-align: center;
}
.mores img {
  width: 120px;
  height: 120px;
  margin: 30px auto 0;
}
.mores span {
  display: block;
  text-align: center;
}
.width1 {
  width: 9%;
  text-align: center;
}
.width2 {
  width: 13%;
  text-align: center;
}
.width3 {
  width: 20%;
  text-align: center;
}
.loss-modal {
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
.content {
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
.loss-madal-content {
  margin: 0 15px;
  padding-bottom: 10px;
}
.loss-madal-content div {
  line-height: 40px;
  margin-bottom: 10px;
}
.loss-madal-content div p {
  display: inline-block;
  border: 1px solid #2e333c;
  border-radius: 3px;
  height: 40px;
  position: relative;
}
.loss-madal-content p span {
  display: inline-block;
  width: 60px;
  text-align: center;
  font-size: 30px;
  position: relative;
  top: -3px;
}
.loss-madal-content input {
  background-color: rgba(0, 0, 0, 0);
  border-left: 1px solid #2e333c;
  border-right: 1px solid #2e333c;
  line-height: 40px;
  position: relative;
  top: -8px;
  color: #c7cce6;
  text-align: center;
}
.modal-text {
  width: 100%;
  text-align: center;
  line-height: 60px;
}
.modal-btn {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  font-size: 0;
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
.total-pro button {
  border-radius: 3px;
  color: white;
  background-color: #638bd4;
  cursor: pointer;
  min-height: 33px;
  min-width: 80px;
  font-size: 14px;
  border: none;
  padding: 0 5px;
  line-height: 33px;
  text-align: center;
}
.stopModal {
  margin: 20px 15px;
  text-align: center;
  padding-bottom: 20px;
}
.stopModal span {
  padding: 6px 15px;
  border-radius: 4px;
}
.stopall {
  border: 1px solid #638bd4;
  color: #638bd4;
  margin-right: 10px;
}
.alls {
  color: #fff;
  background-color: #638bd4;
}
.stopbuy {
  border: 1px solid #0d8551;
  color: #0d8551;
  margin-right: 10px;
}
.buys {
  color: #fff;
  background-color: #0d8551;
}
.stopsell {
  border: 1px solid #cc4951;
  color: #cc4951;
}
.sells {
  color: #fff;
  background-color: #cc4951;
}
.stop-modal-btns {
  width: 100%;
  font-size: 0;
}
.stop-modal-btns button {
  width: 50%;
  float: left;
  font-size: 14px;
  line-height: 40px;
  background-color: #9db5c7;
  border: none;
  outline: none;
  color: #fff;
}
.stop-modal-btns button:last-child {
  background-color: #689cf1;
}
</style>
