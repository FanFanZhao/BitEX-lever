<template>
    <div class="main">
        <p class="legal_name">{{legal_name}}</p>
        <div class="legalAccount_msg flex between">
          <div>
              <p class="ft12 msg_title">可用</p>
              <p>{{legal_balance}}</p>
          </div>
          <div>
              <p class="ft12 msg_title">冻结</p>
              <p>{{lock_legal_balance}}</p>
          </div>
          <div>
              <p class="ft12 msg_title">折合（CNY）</p>
              <p>{{(legal_balance - 0 + (lock_legal_balance-0))*ustd_price*usprice}}</p>
          </div>
        </div>
        <div class="rec_wrap">
           <p class="rec_title flex between">
               <span>财务记录</span>
               <span class="all">全部</span>
           </p>
           <p class="list_title flex around">
               <span class="ft14">数量</span>
               <span class="ft14">记录</span>
               <span class="ft14">时间</span>
           </p>
           <p style="text-align:center;margin:30px 0;">暂无记录</p>
           <ul>
              <li class="flex arround ft12"></li>
           </ul>
        </div>
        <!-- <router-link tag="p" class="huazhuan" to='/transferLegal'>划转</router-link> -->
    </div>
</template>
<script>
export default {
    data(){
        return{
           legal_name:'',
           legal_balance:'',
           lock_legal_balance:'',
           ustd_price:''
        }
    },
    created(){
       this.token = localStorage.getItem('token') || '';
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
        var that = this
                 this.$http({
                    url: '/api/' + 'wallet/detail',
                    method:'post',
                    data:{
                        currency:this.$route.params.currency_id,
                        type:'legal'
                    },
                    headers: {'Authorization':  that.token}
                    }).then(res=>{  
                        if(res.data.type  =='ok'){
                            var msg = res.data.message;
                            that.legal_name = msg.currency_name;
                            that.legal_balance = msg.legal_balance;
                            that.lock_legal_balance = msg.lock_legal_balance;
                            that.ustd_price = msg.ustd_price;
                        }else{
                            // layer.msg(res.message);
                        }
                    }).catch(error=>{
                        console.log(error)
                    })
                        
        }
    }
}
</script>
<style scoped>
   .legal_name{
       background: #1b1e2e;
       padding: 5px 0;
   }
    .msg_title{
        color: #61688a;
    }
   .main{
       color:#fff;
       padding: 30px;
   }
   .legalAccount_msg{
       background: #1b1e2e;
       padding: 6px 0;
   }
   .legalAccount_msg div p:first-child{
       margin-bottom: 10px;
   }
   .rec_wrap{
       margin-top: 30px;
       margin-bottom: 30px;
   }
   .rec_title{
       margin-bottom: 10px;
       
   }
   .all{
        color: #61688a;
   }
   .list_title{
       padding: 10px 0;
       background: #1b1e2e;
   }
   .huazhuan{
       text-align: center;
       margin-top: 60px;
       background: #7a98f7;
       padding: 8px;
   }
   .huazhuan:hover{
       cursor: pointer;
   }
</style>
