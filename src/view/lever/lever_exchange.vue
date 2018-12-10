<template>
  <div class="exchange">
    <!-- <div class="title fColor1">交易所</div> -->
    <div class="content fColor1">
      <div class="new_price">
        <span class="ft14">最新价 {{newData | tofixedFour}}{{currency_name}}</span>
      </div>
      <div class="exchange_title ft12 clear tc">
        <span>方向</span>
        <span>价格({{currency_name}})</span>
        <span>数量({{legal_name}})</span>
      </div>
      <ul class="list-item ft12 tc">
        <li class="curPer" v-for="(out,index) in outlist" :key="out.id" @click="price(out.price)">
          <span class="red">卖 {{outlist.length-index}}</span>
          <span>{{out.price | tofixedFour}}</span>
          <span>{{out.number | tofixed}}</span>
        </li>
        <div class="line"></div>
        <li class="curPer" v-for="(buy,index) in inlist" :key="index" @click="price(buy.price)">
          <span class="green">买 {{index+1}}</span>
          <span>{{buy.price | tofixedFour}}</span>
          <span>{{buy.number | tofixed}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "exchange",
  data() {
    return {
      outlist: [],
      inlist: [],
      load: 1,
      newData: 0,
      currency_name: "",
      legal_name: "",
      currency_id: "",
      legal_id: ""
    };
  },
  filters: {
    tofixed: function(val) {
      val = Number(val);
      return val.toFixed(2);
    },
    tofixedFour: function(val) {
      val = Number(val);
      return val.toFixed(4);
    },
  },
  mounted: function() {
    var that = this;
  },
  created: function() {
    let that = this;
    var local_lid = window.localStorage.getItem("lever_l_id"),
      local_cid = window.localStorage.getItem("lever_c_id");
    that.legal_id = localStorage.getItem("legal_id");
    that.currency_id = localStorage.getItem("currency_id");
    that.legal_name = localStorage.getItem("legal_name");
    that.currency_name = localStorage.getItem("currency_name");
    that.buy_sell(that.legal_id, that.currency_id);
    setInterval(function(){
      that.buy_sell(that.legal_id, that.currency_id);
    },3000)
    that.connect(
      this.legal_id,
      this.currency_id
    );
    
  },
  methods: {
    price(price) {
      eventBus.$emit("toPrice", price);
    },
    // 第一次默认最新价数据
    buy_sell(legals_id, currencys_id) {
      let that = this;
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
          if (res.data.type == "ok") {
            that.inlist = res.data.message.lever_transaction.in;
            that.outlist = res.data.message.lever_transaction.out.reverse();
            that.newData = res.data.message.last_price;
            window.localStorage.setItem('lastPrice',that.newData);
            that.buyInfo.buyPrice = 0;
            that.buyInfo.buyNum = 0;
            that.connect(
              legals_id,
              currencys_id
            );
          } else if (res.data.type == "999") {
            this.$router.push("/components/login");
          } else {
            layer.msg(res.data.message);
          }
        })
        .catch(error => {
          // console.log(error)
        });
    },
    connect(legal_id, currency_id) {
      var that = this;
      that.$socket.emit("login", localStorage.getItem("user_id"));
      that.$socket.on("transaction", msg => {
        if (msg.type == "transaction") {
          //组件间传值
          var newPrice = {
            newprice: msg.last_price,
            newup: msg.proportion,
            istoken: msg.token,
            yesprice: msg.yesterday,
            toprice: msg.today
          };
          setTimeout(() => {
            eventBus.$emit("toNew01", newPrice);
          }, 1000);
          that.newData = msg.last_price;
          var inData = JSON.parse(msg.in);
          var outData = JSON.parse(msg.out);
          if (msg.currency_id == legal_id && msg.legal_id == currency_id) {
            that.inlist = inData;
            that.outlist = outData;
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.title {
  height: 48px;
  line-height: 48px;
  padding: 0 10px 0 30px;
  background-color: #181b2a;
}
.content {
  padding: 0 10px;
}
.new_price {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #303b4b;
  padding: 0 0 0 20px;
}
.exchange_title {
  line-height: 25px;
  position: relative;
  color: #637085;
}
.list-item li {
  line-height: 25px;
  overflow: hidden;
}
.list-item li span,
.exchange_title span {
  width: 33.3%;
  display: block;
  float: left;
}
.green {
  color: #55a067;
}
.red {
  color: #cc4951;
}
.list-item li:hover {
  background: #262a42;
}
.line {
  height: 5px;
  border-bottom: 1px solid #303b4b;
}
</style>
