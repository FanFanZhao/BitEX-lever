<template>
    <div id="transfer-legal" v-if="coins.length">
       <div class="title">划转</div>
       <ul class="coins">
           <li v-for="(coin,index) in coins" :key="index" :class="{active:index == coinIndex}" @click="coinIndex = index;number = ''">
               {{coin.currency_name}}
           </li>
       </ul>
       <div class="types">
           <div class="types-l">
               <div>从</div>
               <div>到</div>
           </div>
           <div class="types-r">
               <div>
                   <div>{{types[0]}}</div>
                   <div>{{types[1]}}</div>
               </div>
               <img src="../../../static/imgs/transfer1.png" alt="" @click="types.reverse()">
           </div>
       </div>
       <div class="number">
           <input type="number" placeholder="请输入划转数量" v-model="number">
           <span style="color:#61688a">{{coins[coinIndex].currency_name}}</span>
           <span class="all" @click="number = coins[coinIndex].legal_balance">全部</span>
       </div>
       <div class="balance" style="line-height:60px;margin:20px 0 30px">可用：{{coins[coinIndex].legal_balance}}</div>
       <button type='button' class="transfer" @click="transfer">划转</button>
    </div>
</template>

<script>
export default {
  data() {
    return {
      token: "",
      selectedCoin: { name: "", id: "" },
      coins: [],
      coinIndex: 0,
      types:['交易账户','法币账户'],
      number:''
    };
  },
  created() {
    this.getCoins();
  },
  methods: {
    getCoins() {
      this.token = window.localStorage.getItem("token") || "";
      this.$http({
        url: "/api/wallet/list",
        method: "post",
        headers: { Authorization: this.token }
      }).then(res => {
        if (res.data.type == "ok") {
          this.coins = res.data.message.legal_wallet.balance;
        }
      });
    },
    transfer(){
        if(this.number == ''){
            layer.msg('请输入划转数量');return;
        } else {
            let data = {};
            data.number = this.number;
            data.type = this.types[0] == '交易账户'?2:1;
            data.currency_id = this.coins[this.coinIndex].currency;
            // console.log(data);return;
            
            this.$http({
                url:'/api/wallet/change',
                method:'post',
                data:data,
                headers: { 'Authorization': this.token }
            }).then(res => {
                if(res.data.type == 'ok'){
                        // layer.msg(res.data.message)

                    setTimeout(() => {
                        this.$router.push({path:'/legalAccount',name:'legalAccount',params:{currency_id:this.coins[this.coinIndex].currency}})
                    },2000)
            
                    
                    
                    // this.$router.push({path:'/legalAccount'})
                }
            })
        }
    }
  }
};
</script>

<style lang='scss' scoped>
#transfer-legal {
  padding: 0 30px;
  color: #c7cce6;
  > .title {
      padding: 20px 0;
    font-size: 24px;
    color: #61688a;
  }
  > .coins {
    display: flex;
    justify-content: center;
    li {
      margin-right: 20px;
      padding: 5px 20px;
      color: #fff;
      background: #234165;
    }
    .active {
      background: #7a98f7;
    }
  }
  >.types{
      margin: 30px 0;
    //   width: 400px;
      height: 80px;
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      .types-r{
          display: flex;
      }
      img{
          margin: 25px;
          width: 30px;
          height: 30px;
      }
  }
  .number{
      margin: 30px 0 0;
    //   width: 430px;
      line-height: 40px;
      input{
          border:none;
          color:#f2f5ff;
          background: none;
          line-height: 40px;
          width: 800px;
      border-bottom: 2px solid #ccc;

      }
      .all{
          margin-left: 10px;
          padding-left: 10px;
          border-left: 1px solid #ccc;
      }
  }
  .transfer{
      display: block;
      margin: 0 auto;
      line-height: 40px;
      width: 200px;
      background: #7a98f7;
      color: #fff;
      border: none;
  }
}
</style>
