<template>
    <div class="market" >
		<div class="m_title  clear fColor1">
            <span class="fff fl">市场</span>
            <div class="m_search fr">
               <input type="text" class="fColor1">
               <img src="../assets/images/search.png" alt="">
            </div>
        </div>
        <div class="m_filter">
            <div class="tabtitle fColor1 ft14 curPer flex around">
                <!-- <span class="active">JNB</span> -->

                <!-- <span class="active">USDT</span>
                <span>JNB</span>
                <span>JNB</span> -->
                <span v-for="(tab,index) in tabList " :key="index" :class="{'active': index == (legal_index || isShow)}" @click="changeType(index,tab.name,tab.id)">{{tab.name}}</span>
            </div>
        </div>
        <div class="coin-title clear">
            <div>
                <span>币种</span>
                <img src="../assets/images/select0.png" alt="">
            </div>
            <div>
                <span>最新价</span>
                <img src="../assets/images/select0.png" alt="">
            </div>
            <div>
                 <span>涨幅</span>
                <img src="../assets/images/select0.png" alt="">
            </div>
        </div>
        <div class="line"></div>
        <ul class="coin-wrap scroll">
            <!-- <li>
                <span v-for="item in newData">{{item}}</span>
            </li> -->
            <li v-for="(market,index) in marketList " :key="index" v-if="(legal_index || isShow) == index" >
              <p v-for="(itm,idx) in market" :key="itm.id" :class="{'active_p':(legal_index || isShow)==index&&idx==(currency_index || ids)}" :data-id='itm.id' :data-index='idx' @click="quota_shift(idx,itm.id,itm.name)">
                <span>{{itm.name}}</span>
                <span :data-name='currency_name+"/"+itm.name'>${{itm.last_price}}</span>
                <span :class="{'green':itm.proportion>=0}">{{itm.proportion>=0?('+'+(itm.proportion-0).toFixed(2)):(itm.proportion-0).toFixed(2)}}%</span>
                </p>
            </li>
            
        </ul>
	</div>
</template>

<script>
    export default {
        name: "market",
        data (){
            return{
                ids:0,
                isShow:0,
                tabList:[],
                marketList:[],
                newData:['BitEX', "$0.076128",'-1.11%'],
                legal_index:this.$route.params.legal_index,
                currency_index:this.$route.params.currency_index,
                tradeDatas:'',

            }
        },
        created:function(){
            // this.init();

          
            //法币列表
            this.$http({
					url: '/api/' + 'currency/quotation',
					method:'get',
					data:{}
				}).then(res=>{
                    // console.log(res);
                    if(res.data.type == 'ok'){
                      this.tabList = res.data.message;
                      var msg = res.data.message;
                      var arr_quota = [];
                      for(var i=0;i<msg.length;i++){
                          arr_quota[i] = msg[i].quotation
                      };
                    //   console.log(arr_quota);
                      this.marketList = arr_quota;
                    //   console.log(this.marketList);
                      //默认法币id和name
                       this.currency_name = msg[0].name;
                       this.currency_id = msg[0].id;
                       var id = arr_quota[0][0].id;
                       var legal_name = arr_quota[0][0].name;
                        // console.log(this.currency_name);
                        // console.log(this.currency_id);
                     var tradeDatas = {
                        currency_id:this.currency_id,
                        legal_id:id,
                        currency_name:this.currency_name,
                        leg_name:legal_name
                    }
                    if(!localStorage.getItem('legal_id')&&!localStorage.getItem('currency_id')&&!localStorage.getItem('legal_name')&&!localStorage.getItem('currency_name')){
                        window.localStorage.setItem('legal_id',id);
                        window.localStorage.setItem('currency_id',this.currency_id);
                        window.localStorage.setItem('legal_name',legal_name);
                        window.localStorage.setItem('currency_name',this.currency_name);
                    }
                    
                 //组件间传值
                 setTimeout(() => {
                   eventBus.$emit('toTrade0',tradeDatas);
                 },1000);
                  setTimeout(() => {
                   eventBus.$emit('toExchange0',tradeDatas);
                 },1000)
                    }
					
				}).catch(error=>{
					console.log(error)
                })
                
        },
        mounted(){
            var that =this;
            eventBus.$on('toNew', function (data) {
               console.log(data);
               if(data){
                    var newprice=data.newprice;
                    var cname=data.istoken;
                    var newup=(data.newup).toFixed(2);
                    console.log(newup) 
                    if(newup>=0){
                        newup="+"+newup+'%';
                        $("span[data-name='"+cname+"']").next().css('color','#55a067')
                    }else{
                        newup=newup+'%';
                        $("span[data-name='"+cname+"']").next().css('color','#cc4951')
                    }
                    $("span[data-name='"+cname+"']").html('$'+newprice).next().html(newup);
               }
            }); 
        },
        methods:{
            changeType(index,currency,currency_id){
               this.isShow=index;
               this.ids = 'a';
               this.currency_name = currency;
               this.currency_id = currency_id;
            //    console.log(this.currency_name);
            //    console.log(this.currency_id)
            },
            getSymbols(callback){
                if(this.address.length<=0){
                    return false;
                }
                this.$http({
                    url:'/api/'+'wallet/list?user_id='+this.address||'',
                    type:'GET'
                }).then(res=>{
                    // console.log(res)
                    if(res.data.type=='ok'){
                        this.accountInfo=res.data.message;
                        this.dataList=res.data.message.list;
                        // console.log(this.dataList)
                        callback && callback();
                    }else{
                        // console.log(123)
                        // alert(res.message)
                    }  
                }).catch(error=>{
                    return error
                })
            },
            init(){
                // var index=layer.load();
                this.address = localStorage.getItem('address') || '';
                this.$http({
                    url: '/api/'+'quotation_new',
                    method:'post',
                    headers: {'Authorization':  localStorage.getItem('token')}, 
                }).then(res=>{
                    // layer.close(index);
                    // console.log(res)
                     if(res.data.type=="ok"){
                         this.getSymbols(()=>{
                            this.marketList=res.data.message.coin_list;
                            // console.log(res.data.message.coin_list)
                            for(var i in this.dataList){
                                for(var j in this.marketList){
                                    // console.log(this.dataList[i].name,this.marketList[j].symbol,this.dataList[i].name==this.marketList[j].symbol)

                                    if(this.dataList[i].name == this.marketList[j].symbol){
                                        // console.log(1)
                                        this.marketList[j].type=this.marketList[j].type||1
                                    }else{
                                        this.marketList[j].type=this.marketList[j].type||0
                                    }
                                }
                            }
                            // console.log(this.marketList)

                         })
                         
                    }else{
                        // layer.msg(res.data.message)
                    }
                    
                }).catch(error=>{
                    console.log(error)
                })
            
            },
            //币种切换
            quota_shift(idx,id,legal_name){
               this.ids = idx;
            //    console.log(idx,id,legal_name);
               var tradeDatas = {
                   currency_id:this.currency_id,
                   legal_id:id,
                   currency_name:this.currency_name,
                   leg_name:legal_name
               }
               window.localStorage.setItem('legal_id',id);
               window.localStorage.setItem('currency_id',this.currency_id);
               window.localStorage.setItem('legal_name',legal_name);
               window.localStorage.setItem('currency_name',this.currency_name);
               location.reload()
               //向兄弟组件传数据
               eventBus.$emit('toTrade',tradeDatas);
               eventBus.$emit('toExchange',tradeDatas)
            },
            

        },
        
    }
</script>

<style scoped>
.m_title{height: 55px;padding: 15px 30px;line-height: 25px;position: relative;}
.m_search input{border-radius: 3px;background: transparent;border: 1px solid #52688c;line-height: 25px;}
/* .m_search{position: absolute;width: 146px;right: 20px;top: -4px;height: 26px;border-radius: 3px;padding: 4px 8px 4px 0;} */
/* .m_search input{position: absolute;left: 0;top: 10px;z-index: 2;width: 100%;padding: 5px 40px 5px 8px;height: 26px;border-radius: 3px;background: transparent;border: 1px solid #52688c;} */
.m_search img{width: 16px;height: 15px;position: absolute;right: 35px;top: 20px;z-index: 123;}
.m_filter{padding: 10px 0 15px;}
.tabtitle span {text-align: center;padding: 0 10px;}
.coin-title div{width: 33.3%;height: 36px;line-height: 36px;background-color: #181b2a;text-align: center;float: left;color: #637085;font-size:12px;}
.coin-title img{vertical-align: middle;margin-top: -3px;}
.line{width: 90%;margin: 0px auto;border-bottom: 1px solid rgb(48, 59, 75);}
.coin-wrap{height: 395px;overflow: auto;background-color: #181b2a;}
.coin-wrap li{height: 30px;line-height: 30px;cursor: pointer;font-size: 12px;color: #cdd6e4;}
.coin-wrap li span{display: block;width: 33%;float: left;text-align: center;}
.coin-wrap li span:last-child{color: #cc4951;}
.coin-wrap li:nth-child(odd){background-color: #181b2a;}
.coin-wrap li span.green{color: #55a067;}
.coin-wrap li p{
    overflow: hidden;
}
.active_p{
    background-color: #2b3648;
}
.coin-wrap li p:hover{background-color: #2b3648;}
</style>
