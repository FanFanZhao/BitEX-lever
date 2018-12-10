<template>
  <div class>
    <div class="content fColor1">
      <div class="record" @click="link()">记录</div>
      <div class="flex">
        <p>从</p>
        <p class="trade">{{name}}</p>
        <p style="cursor: pointer;" @click="tabClick">至</p>
        <p class="trade">{{leverName}}</p>
      </div>

      <div class="num">
        <p>划转数量</p>
        <input type="text" placeholder="请输入划转数量" v-model="inputValue">
        <p>可用余额：{{totalMoney || '0.00' | toFixeds}}USDT</p>
      </div>
      <button type="button" class="comfirm-btn" @click="comfirm()">确认划转</button>
    </div>
  </div>
</template>
<script>
import indexHeader from "@/view/indexHeader";
import left from "@/view/left";
export default {
  name: "transfer",
  filters: {
    toFixeds: function(value) {
      value = Number(value);
      return value.toFixed(2);
    }
  },
  data() {
    return {
      name: "C2C账户",
      leverName: "杠杆账户",
      totalMoney: "",
      leverMoney: "",
      tradeMoney: "",
      type: 2,
      token: localStorage.getItem("token"),
      inputValue:'',
      currencyId:''
    };
  },
  components: {
    indexHeader,
    left
  },
  methods: {
    init() {
      var that = this;
      this.$http({
        url: "/api/" + "wallet/list",
        method: "post",
        data: {},
        headers: { Authorization: that.token }
      })
        .then(res => {
          if (res.data.type == "ok") {
            let list = res.data.message.legal_wallet.balance;
            let lists = res.data.message.lever_wallet.balance;
            console.log(list);
            console.log(lists);
            for (let i = 0; i < list.length; i++) {
              if (list[i].currency_name == "USDT") {
                that.tradeMoney = list[i].legal_balance;
                console.log(that.tradeMoney);
                that.totalMoney = that.tradeMoney;
                that.currencyId = list[i].currency;
              }
            }
            for (let j = 0; j < lists.length; j++) {
              if (lists[j].currency_name == "USDT") {
                that.leverMoney = lists[j].lever_balance;
                that.currencyId = lists[j].currency;
              }
            }
          } else {
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    tabClick() {
      let that = this;
      if (that.type == 1) {
        that.type = 2;
        that.name = "C2C账户";
        that.leverName = "杠杆账户";
        that.totalMoney = that.tradeMoney;
        console.log(1);
      } else {
        that.type = 1;
        that.name = "杠杆账户";
        that.leverName = "C2C账户";
        that.totalMoney = that.leverMoney;
      }
      console.log(that.type);
    },
    // 确认互转
    comfirm(){
      var that = this;
      if(that.inputValue == ''){
        layer.msg("请输入划转数量");
        return false;
      }
      var i = layer.load()
      this.$http({
        url: "/api/" + "wallet/change",
        method: "post",
        data: {
          number:that.inputValue,
          currency_id:that.currencyId,
          type:that.type
        },
        headers: { Authorization: that.token }
      })
        .then(res => {
          if (res.data.type == "ok") {
             layer.close(i);
             layer.msg(res.data.message);
             setTimeout(function(){
               that.$router.push({name:'transferRecord'})
             },500)
          } else {
            layer.msg(res.data.message)
            layer.close(i);
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
      
    },
    link(){
      this.$router.push({name:'transferRecord'})
    }
  },
  created() {
    this.token = localStorage.getItem("token") || "";
    this.init();
  },

  mounted() {
    var that = this;
  }
};
</script>
<style scoped lang="scss">
.record{
  position: absolute;
  right: 0;
  top: 100px;
  cursor: pointer;

}
.content {
  width: 600px;
  padding-top: 100px;
  line-height: 30px;
  margin: 0 auto;
  position: relative;
}
.trade {
  width: 110px;
  line-height: 30px;
  border: 1px solid #4e5b85;
  text-align: center;
  border-radius: 4px;
  margin-right: 15px;
  margin-left: 15px;
}
.num {
  margin-top: 15px;
}
.num input {
  width: 450px;
  height: 40px;
  line-height: 40px;
  border: 1px solid #4e5b85;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0);
  padding: 0 10px;
  color: #fff;
  margin-top: 15px;
  margin-bottom: 15px;
}
.comfirm-btn {
  width: 450px;
  line-height: 40px;
  border-radius: 6px;
  margin-top: 40px;
  background-color: #4e5b85;
  color: #fff;
  border: none;
  outline: none;
}
</style>


