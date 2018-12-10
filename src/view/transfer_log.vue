<template>
    <div class="account-main wrap">
        <ul class="white log_ul">
            <li class="flex ft14">
                <span class="flex1 tc">时间</span>
                <span class="flex1 tc">账户</span>
                <span class="flex1 tc">说明</span>
                <span class="flex1 tc">金额</span>
            </li>
            <div class="li_wrap scroll">
                <li class="flex ft12 around" v-for="(item,index) in log_list" :key="index">
                    <span class="flex1 tc">{{item.created_time}}</span>
                    <span class="flex1 tc">{{item.account}}</span>
                    <span class="flex1 tc">{{item.info}}</span>
                    <span class="flex1 tc">{{item.value}}</span>
                </li>
                <p class="tc more" @click="getMore">{{more}}</p>
            </div>
        </ul>
       
    </div>
</template>
<script>
export default {
    data(){
        return {
            more:'加载更多',
            page:1,
            limit:20,
            log_list:[]
        }
    },
    created(){

    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
                this.$http({
                    url: '/api/'+'account/list',
                    method:'post',
                    data:{limit:this.limit,page:this.page},  
                    headers: {'Authorization':  localStorage.getItem('token')},    
                }).then(res=>{
                     console.log(res)
                    console.log(res.data.message.data)
                    if(res.data.type=="ok"){
                        this.log_list = this.log_list.concat(res.data.message.data);
                        if(res.data.message.data.length == 0){
                            this.more = '暂无交易记录'
                        }
                        if(res.data.message.data.length<this.limit){
                            this.more = '没有更多记录了...'
                        }else if(res.data.message.data.length==this.limit){
                             this.more = '加载更多'
                        }
                    }else{
                        layer.msg(res.data.message)
                    }
                }).catch(error=>{
                    // console.log(error)
                })
        },
        getMore(){
             this.more = '加载中...'
            this.page+=1;
            this.init();
        }
        
    }
}
</script>
<style scoped>
    .wrap{
        overflow: auto;
    }
    .li_wrap{
        max-height: 600px;
        overflow-y: auto;
    }
   .log_ul li{
       padding: 15px 0;
   }
   .log_ul>li:first-child{
      border-bottom: 1px solid #303b4b;
   }
   .log_ul>li:first-child:hover{
       background: #181b2a;
   }
   .log_ul li:hover{
       background: #61688a;
   }
   .more{
        color: #999; 
        font-size: 12px;
        margin-top: 10px;
        cursor: pointer;
   }
   ::-webkit-scrollbar{
       background-color: #181b2a;
   }
</style>
