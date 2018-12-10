<template>
    <div>
        <div class="top">
            <p>C2C账户  总资产折合：{{totle}}CNY</p>
        </div>
        <ul class="list">
            <li v-for="(item,index) in list" :key="index" v-if="item.is_legal == 1 && item.is_lever == 1" @click="go_legalAccount(item.currency)">
                <p class="legal_name">{{item.currency_name}}</p>
                <div class="balance_detail">
                    <div class="use_balance flex1">
                       <p class="ft12 mincny">币种</p>
                       <p class="use_balance_num">{{item.currency_name}}</p>
                    </div>
                    <div class="flex1">
                       <p class="ft12 mincny">可用</p>
                       <p class="lock_balance_num">{{item.legal_balance || '0.00' | toFixeds}}</p>
                    </div>
                    <div class="convert flex1">
                       <p class="ft12 mincny">冻结</p>
                       <p class="lock_balance_num">
                           {{item.lock_legal_balance || '0.00' | toFixeds}}
                       </p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return{
          totle:'',
          list:[],
        //   usprice:''
        }
    },
    filters: {
    toFixeds: function(value) {
      value = Number(value);
      return value.toFixed(2);
    }
  },
    created(){
       this.token = localStorage.getItem('token') || '';
    },
    mounted(){
       this.legal();
    },
    methods:{
         //法币账户
         legal(){
             var that = this
                 this.$http({
                    url: '/api/' + 'wallet/list',
                    method:'post',
                    data:{},
                    headers: {'Authorization':  that.token}
                    }).then(res=>{
                        
                        if(res.data.type  =='ok'){
                            that.list = res.data.message.legal_wallet.balance;
                            this.totle = res.data.message.legal_wallet.totle;
                        }else{
                            // layer.msg(res.message);
                        }
                    }).catch(error=>{
                        console.log(error)
                    })
        },
        go_legalAccount(currency_id){
             this.$router.push({
                path:'/legalAccount',
                name:'legalAccount',
                params:{
                  currency_id:currency_id
                }
            })
        }
    }
}
</script>
<style scoped>
    .flex1{
        flex: 1;
    }
   .top{
       background: #1b1e2e;
       color: #fff;
       padding: 15px 30px;
   }
   .all_account{
       color: #61688a;
   }
   .list{
       padding: 15px 30px;
   }
   .balance_detail{
       display: flex;
       justify-content: space-between;
       align-items: center;
       color: #61688a;
   }
   .legal_name{
       color: #61688a;
       padding: 10px 0;
   }
   .use_balance_num,.lock_balance_num,.lock_balance_num{
       color: #fff;
       padding: 10px 0;
       margin-top: 5px;
   }
   .list li{
       border-bottom: 1px solid #1B2A3E;
   }
   .convert{
       padding: 10px 0;
   }
</style>


