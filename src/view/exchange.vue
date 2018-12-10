<template>
    <div class="exchange">
		<!-- <div class="title fColor1">交易所</div> -->
        <div class="content fColor1">
            <div class="new_price">
                <span class="ft14">最新价 {{newData}}{{currency_name}}</span>
            </div>
            <div class="exchange_title ft12 clear tc">
                <span>方向</span>
                <span>价格({{currency_name}})</span>
                <span>数量({{legal_name}})</span>
                <span>总计</span>
            </div>
            <ul class="list-item ft12 tc scroll">
                <li class="curPer" v-for="(out,index) in outlist" :key="index" @click="price(out.price)">
                    <span class="red">卖 {{outlist.length-index}}</span>
                    <span>{{out.price}}</span>
                    <span>{{out.number}}</span>
                    <span>{{out.sum}}</span>
                </li>
                <div class="line"></div>
                 <li class="curPer" v-for="(buy,index) in inlist" :key="index" @click="price(buy.price)">
                    <span class="green">买 {{index+1}}</span>
                    <span>{{buy.price}}</span>
                    <span>{{buy.number}}</span>
                    <span>{{buy.sum}}</span>
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
  mounted: function() {
    var that = this;
  },
  created: function() {
    var local_lid = window.localStorage.getItem("l_id"),
      local_cid = window.localStorage.getItem("c_id");
    var that = this;
    this.legal_id = localStorage.getItem("legal_id");
    this.currency_id = localStorage.getItem("currency_id");
    this.legal_name = localStorage.getItem("legal_name");
    this.currency_name = localStorage.getItem("currency_name");
    that.buy_sell(this.legal_id, this.currency_id);
    that.connect(
      this.legal_id,
      this.currency_id
    );
    // eventBus.$on("toExchange0", function(data0) {
    //   console.log(data0);
    //   c_id = data0.currency_id,
    //   l_id = data0.legal_id;
    //   that.currency_name = data0.currency_name;
    //   that.legal_name = data0.leg_name;
    //   console.log(local_lid,local_cid)
    //   that.buy_sell(l_id,c_id);
    //   that.connect(l_id,c_id)
    // });
    // eventBus.$on("toExchange", function(data) {
    //   console.log(data);
    //   c_id = data.currency_id,
    //   l_id = data.legal_id;
    //   that.currency_name = data.currency_name;
    //   that.legal_name = data.leg_name;
    //   that.buy_sell(l_id,c_id);
    //   that.connect(l_id,c_id)
    // });
    // 下单强制更新数据
    // eventBus.$on('tocel', function (datas) {
    //   if(datas){
    //     that.buy_sell(that.legal_id,that.currency_id);
    //   }
    // })
  },
  sockets: {
    // connect(legal_id,currency_id) {
    //   this.$socket.emit("login", localStorage.getItem('user_id'));
    //   this.$socket.on("transaction", msg => {
    //     // console.log(msg);
    //     if (msg.type == "transaction") {
    //     this.newData = msg.last_price;
    //     var inData = JSON.parse(msg.in);
    //     var outData = JSON.parse(msg.out);
    //     // if(msg.currency==currency_id&&msg.legal == legal_id){
    //       if (inData.length >= 0) {
    //         this.inlist = inData;
    //       }
    //       if (outData.length >= 0) {
    //       this.outlist = outData;
    //       }
    //     // }
    //   }
    //   });
    // },
  },
  methods: {
    price(price) {
      eventBus.$emit("toPrice", price);
    },
    // 第一次默认最新价数据
    buy_sell(legals_id, currencys_id) {
      // var index = layer.load();
      this.$http({
        url: "/api/" + "transaction/deal",
        method: "post",
        data: {
          legal_id: currencys_id,
          currency_id: legals_id
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          // layer.close(i);
          if (res.data.type == "ok") {
            this.inlist = res.data.message.in;
            this.outlist = res.data.message.out.reverse();
            this.newData = res.data.message.last_price;
            this.buyInfo.buyPrice = 0;
            this.buyInfo.buyNum = 0;
            this.connect(
              legals_id,
              currencys_id
            );
          } else {
            // layer.msg(res.data.message)
          }
        })
        .catch(error => {
          // console.log(error)
        });
    },
    connect(legal_id, currency_id) {
      // console.log(legal_id,currency_id)
      var that = this;
      // console.log('socket')
      //localStorage.getItem('user_id')
      var nums = Math.floor(Math.random() * 40) + 60;
      var socket_user_id = new Date().getTime() + nums;
      that.$socket.emit("login", socket_user_id);
      that.$socket.on("transaction", msg => {
        // console.log(msg);
        if (msg.type == "transaction") {
          //组件间传值
          
          var newPrice = {
            newprice: msg.last_price,
            newup: msg.proportion,
            istoken: msg.token,
            yesprice: msg.yesterday,
            toprice: msg.today
          };
          eventBus.$emit("toNew", newPrice);
          if (msg.token == that.currency_name + "/" + that.legal_name) {
            that.newData = msg.last_price;
          }

          var inData = JSON.parse(msg.in);
          var outData = JSON.parse(msg.out);
          if (msg.currency_id == legal_id && msg.legal_id == currency_id) {
            if (inData.length >= 0) {
              that.inlist = inData;
            }
            if (outData.length >= 0) {
              that.outlist = outData;
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.exchange{
  height: 100%;
}
.title {
  height: 48px;
  line-height: 48px;
  padding: 0 10px 0 30px;
  background-color: #181b2a;
}
.content {
  padding: 0 10px;
  height: 100%;
}
.new_price {
  /* height: 40px; */
  /* line-height: 40px; */
  border-bottom: 1px solid #303b4b;
  padding: 3px 20px;
}
.exchange_title {
  line-height: 25px;
  position: relative;
  color: #637085;
}
.list-item li {
  line-height: 25px;
  overflow-y: auto;
  overflow-x: hidden;
}
.list-item{
  height: calc(100% - 50px);
  overflow: auto;
}
.list-item li span,
.exchange_title span {
  width: 25%;
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
