<template>
    <div class="trade">
        <div class="title_box">
            <div class="tabtitle fColor1 ft16curPer">
                <span :class="{active:show == true}">限价交易</span>
                <!-- <span :class="{active:show == false}" @click="changeType">市价交易</span> -->
            </div>
        </div>
        <!-- 限价交易 -->
        <div class="content clear" v-if="show">
            <div class="w50 fl first">
               
                <div class="ft14">
                    <div class="available clear fColor1" v-if="address.length<=0"><span class="baseColor curPer" @click="goNext('login')">登录</span>
                    或 <span class="baseColor curPer" @click="goNext('register')">注册</span>
                    开始交易
                    </div>
                    <div class="clear available" v-else>
                        <span class="fl fColor1">可用 {{user_legal}} {{currency_name}}</span>
                        <!-- <span class="fr baseColor curPer" @click="goNext('account')">充币</span> -->
                    </div>
                    <div class="mt40 input-item clear">
                        <label>买入价</label>
                        <input type="number" v-model="buyInfo.buyPrice" @keydown.69.prevent >
                        <span>{{currency_name}}</span>
                    </div>
                    <div class="mt40 input-item clear">
                        <label>买入量</label>
                        <input type="number" v-model="buyInfo.buyNum" @keydown.69.prevent  @keyup="numFilter($event)">
                        <span>{{legal_name}}</span>
                    </div>
                    <div class="attion tr fColor1">范围 (0.000001,20,精度: 0.000001)</div>
                    <div class="mt50 fColor1 ft16">交易额 {{buyTotal}} {{currency_name}}</div>
                    <div class="sell_btn curPer mt40 tc greenBack fColor1 ft16" @click="buyCoin">买{{legal_name}}</div>
                </div>
            </div>
            <div class="w50 fl second">
                <div class="ft14">
                    <div class="available clear fColor1" v-if="address.length<=0"><span class="baseColor curPer" @click="goNext('login')">登录</span>
                    或 <span class="baseColor curPer" @click="goNext('register')">注册</span>
                    开始交易
                    </div>
                    <div class="clear available" v-else>
                        <span class="fl fColor1">可用 {{user_currency}} {{legal_name}}</span>
                        <!-- <span class="fr baseColor curPer" @click="goNext('account')">充币</span> -->
                    </div>
                    <div class="mt40 input-item clear">
                        <label>卖出价</label>
                        <input type="number" @keydown.69.prevent v-model="sellInfo.sellPrice">
                        <span>{{currency_name}}</span>
                    </div>
                    <div class="mt40 input-item clear">
                        <label>卖出量</label>
                        <input type="number" @keydown.69.prevent  @keyup="numFilter($event)" v-model="sellInfo.sellNum">
                        <span>{{legal_name}}</span>
                    </div>
                    <div class="attion tr fColor1">范围 (0.000001,20,精度: 0.000001)</div>
                    <div class="mt50 fColor1 ft16">交易额 {{sellTotal}} {{currency_name}}</div>
                    <div class="sell_btn curPer mt40 tc redBack fColor1 ft16" @click="sellCoin">卖{{legal_name}}</div>
                </div>
            </div>
        </div>
        <!-- 市价交易 -->
        <div class="content clear" v-if="showNone" >
            <div class="w50 fl first">
                <div class="ft14">
                   <div class="available clear fColor1" v-if="address.length<=0"><span class="baseColor curPer" @click="goNext('login')">登录</span>
                    或 <span class="baseColor curPer" @click="goNext('register')">注册</span>
                    开始交易
                    </div>
                    <div class="clear available" v-else>
                        <span class="fl fColor1">可用 {{user_currency}} {{currency_name}}</span>
                        <!-- <span class="fr baseColor curPer" @click="goNext('account')">充币</span> -->
                    </div>
                    <div class="mt40 input-item clear">
                        <label>买入价</label>
                        <input type="number" value="以市场最低价买入" @keydown.69.prevent  disabled>
                        <span>{{currency_name}}</span>
                    </div>
                    <div class="mt40 input-item clear">
                        <label>买入量</label>
                        <input type="number"  @keydown.69.prevent  @keyup="numFilter($event)">
                        <span>{{legal_name}}</span>
                    </div>
                    <div class="sell_btn curPer mt40 tc greenBack fColor1 ft16">买{{legal_name}}</div>
                </div>
            </div>
            <div class="w50 fl second">
                <div class="ft14">
                   <div class="available clear fColor1" v-if="address.length<=0"><span class="baseColor curPer" @click="goNext('login')">登录</span>
                    或 <span class="baseColor curPer" @click="goNext('register')">注册</span>
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
                        <input type="number" @keydown.69.prevent  @keyup="numFilter($event)">
                        <span>{{legal_name}}</span>
                    </div>
                    <div class="sell_btn curPer mt40 tc redBack fColor1 ft16">卖{{legal_name}}</div>
                </div>
            </div>
        </div>  
    </div>
</template>

<script>
    export default {
        name: "trade",
         data (){
            return {
                currency_name:'',
                legal_name:'',
                user_currency:'',
                user_legal:'',
              show:true,
              showNone:false,
              allBalance:0,
              buyInfo:{buyPrice:0,buyNum:0,url:'transaction/in'},
              sellInfo:{sellPrice:0,sellNum:0,url:'transaction/out'}
            }
        },
        created(){
            this.address = localStorage.getItem('token') || '';
            // this.init();
       
        },
        mounted(){
            var that = this;
            that.address = localStorage.getItem('token') || '';
            eventBus.$on('toPrice', function (data) {
              console.log(data);
              if(data){
                that.buyInfo.buyPrice=data;
                that.sellInfo.sellPrice=data;  
              }
            });
            eventBus.$on('toTrade', function (data) {
                // console.log(data);
                that.currency_id = data.currency_id,
                that.legal_id = data.legal_id;
                that.currency_name = data.currency_name;
                that.legal_name = data.leg_name;
                that.buy_sell(that.legal_id,that.currency_id)
            });
            eventBus.$on('toTrade0', function (data0) {
                // console.log(data0);
                that.currency_id = data0.currency_id,
                that.legal_id = data0.legal_id;
                that.currency_name = data0.currency_name;
                that.legal_name = data0.leg_name;
                // console.log(that.currency_name);
                // console.log(that.legal_name);
                that.buy_sell(that.legal_id,that.currency_id)
            });
            eventBus.$on('tocel', function (datas) {
                // console.log(datas);
                if(datas){
                    that.buy_sell(that.legal_id,that.currency_id)
                }  
            })
       
        },
        methods:{
           
            numFilter(ev){
                //48-57 96-105 108
                // console.log(ev.keyCode)
            },
            changeType(){
               this.show = !this.show;
            },
            goNext(url){
                this.$router.push({name: url});
            },
            init(){
                this.$http({
                    url:'/api/'+'transaction/deal',
                    method:'post',
                    data:{
                        address:this.address,
                    }
                }).then(res=>{
                    // console.log(res)
                    this.allBalance=res.data.message.user_cny;
                    // console.log(this.allBalance)
                })
            },
            buyCoin(){
                // var that = this;
                if(!this.buyInfo.buyPrice || this.buyInfo.buyPrice<=0){
                   layer.msg('请输入买入价');
                    return;
                }
                if(!this.buyInfo.buyNum || this.buyInfo.buyNum <=0){
                    layer.msg('请输入买入量');
                    return;
                }
                var i=layer.load();
                this.$http({
                    url: '/api/'+this.buyInfo.url,
                    method:'post',
                    data:{
                        legal_id:this.currency_id,
                        currency_id:this.legal_id,
                        price:this.buyInfo.buyPrice,
                        num:this.buyInfo.buyNum,  
                    },
                     headers: {'Authorization':  localStorage.getItem('token')},           
                }).then(res=>{
                    console.log(res ,222)
                     layer.close(i);
                    
                    if(res.data.type=="ok"){
                        layer.msg(res.data.message)
                        this.buyInfo.buyPrice=0;
                        this.buyInfo.buyNum=0;
                        // that.buy_sell(that.legal_id,that.currency_id)
                        eventBus.$emit('buyTrade','tradebuy');
                        eventBus.$emit('tocel','updata');
                        console.log(res.data.message)
                         
                       
                    }else{
                        layer.msg(res.data.message)
                    }
                }).catch(error=>{
                    console.log(error)
                })
            }, 
            sellCoin(){
                console.log(localStorage.getItem('token'))
                var that = this;
                if(!this.sellInfo.sellPrice || this.sellInfo.sellPrice<=0){
                   layer.msg('请输入卖出价');
                    return;
                }
                if(!this.sellInfo.sellNum || this.sellInfo.sellNum <=0){
                    layer.msg('请输入卖出量');
                    return;
                }
                var i=layer.load();
                this.$http({
                    url: '/api/'+this.sellInfo.url,
                    method:'post',
                    data:{
                        legal_id:this.currency_id,
                        currency_id:this.legal_id,
                        price:this.sellInfo.sellPrice,
                        num:this.sellInfo.sellNum
                    },
                    headers: {'Authorization':  localStorage.getItem('token')}, 
                }).then(res=>{
                    console.log(res)
                    layer.close(i);
                    // layer.msg(res.data.message)
                    if(res.data.type=="ok"){
                        this.sellInfo.sellPrice=0;
                        this.sellInfo.sellNum=0;
                        eventBus.$emit('buyTrade','tradebuy');
                        eventBus.$emit('tocel','updata');
                        // that.buy_sell(that.legal_id,that.currency_id)
                        layer.msg(res.data.message);
                    }else{
                        layer.msg(res.data.message);
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
                //买入、卖出记录
        buy_sell(legals_id,currencys_id){
            this.$http({
                        url: '/api/'+'transaction/deal',
                        method:'post',
                        data:{
                            legal_id:currencys_id,
                            currency_id:legals_id
                        },  
                        headers: {'Authorization':  localStorage.getItem('token')},    
                    }).then(res=>{
                        // console.log(res ,222)
                        // layer.close(i);
                        if(res.data.type == "ok"){
                        
                        this.user_currency = res.data.message.user_currency;
                        this.user_legal = res.data.message.user_legal;
                        // console.log(res.data)
                            this.buyInfo.buyPrice=0;
                            this.buyInfo.buyNum=0;
                        }else{
                            layer.msg(res.data.message)
                        }
                    }).catch(error=>{
                        // console.log(error)
                    })
            }
        },
        computed:{
            buyTotal(){
               return (this.buyInfo.buyPrice * this.buyInfo.buyNum) || 0;
            },
            sellTotal(){
                return this.sellInfo.sellPrice * this.sellInfo.sellNum || 0;
            }
        }
    
        
    }
</script>

<style scoped>
.title_box{height: 48px;line-height: 48px; padding: 0 30px;background-color: #181b2a;box-shadow: 0 2px 6px rgba(0,0,0,.1);}
.tabtitle span{cursor: pointer;}
.tabtitle span:not(:last-child) {margin-right: 40px;}
.content .first{padding: 0 15px 0 25px;}
.content .second{padding: 0 25px 0 15px;}
.available{height: 48px;border-bottom: 1px solid #303b4b;line-height: 48px;}
.input-item{position: relative;line-height: 40px;}
.input-item label{width: 20%;float: left;font-size: 14px;color: #637085;}
.input-item input{width: 80%;float: left;border: 1px solid #52688c;border-radius: 3px;height: 40px;text-indent: 15px;font-size: 16px;color: #cdd6e4;background-color: #262a42;line-height: 38px;}
.input-item span{position: absolute;right: 15px;color: #637085;font-size: 16px}
.attion{height: 20px;line-height: 30px;font-size: 12px;}
.sell_btn{width: 100%;height: 40px;border-radius: 3px;color: #cdd6e4;line-height: 40px;}
.greenBack {background-color: #55a067;}
.redBack {background-color: #cc4951;}
input:disabled {color: #627085;cursor: not-allowed;}
</style>

