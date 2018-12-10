<template>
    <div class="entrust">
        <div class="title fColor1">
            <div class="tab_title">
                <span v-for="(url,index) in urlList" :class="{'active': index == isUrl}" @click="changeType(index,url.url)">{{url.title}}</span>
            </div>
            <div class="tab_title fr ft12">
                <span v-for="(way,index) in wayList" :class="{'active': index == isChoosed}" @click="wayChoose(index,way.type)">{{way.title}}</span>
            </div>
        </div>
        <div class="content" v-show="isUrl==0">
            <ul class="list-title fColor2 ft12 clear">
                <li class="fl w20">时间</li>
                <li class="fl w12">交易对</li>
                <li class="fl w12">方向</li>
                <li class="fl w12">价格</li>
                <li class="fl w14">数量</li>
                <li class="fl w20">委托总额</li>
                <li class="fl w8 tr">操作</li>
            </ul>
            <div class="container scroll" v-if="enList.length>0">
                <ul class="list-item fColor1 ft12">
                    <li v-for="item in enList" class="clear">
                        <span class="fl w20">{{item.create_time}}</span>
                        <span class="fl w12">uadt/btc</span>
                        <span class="fl w12" :class="{'green': item.typeInfo == 'in'}">{{item.typeInfo=='in'?'买入':'卖出'}}</span>
                        <span class="fl w12">{{item.price}}</span>
                        <span class="fl w14">{{item.number}}</span>
                        <span class="fl w20">{{item.price * item.number}}</span>
                        <span class="fl w8 tr curPer ceilColor" @click="revoke(item.id)">撤销</span>
                    </li>
                </ul>
                <div class="getmore tc fColor1 ft14 mt10 curPer" @click="getMore" v-if="!loading && enList.length>12">{{more}}</div>
                <div class="tc" v-if="loading">
                    <img src="@/assets/images/loading.gif" alt=""  class="lodw20">
                    <p class="ft12 baseColor">加载中...</p>
                </div>
            </div>
            <div class="no_data tc" v-if="enList.length<=0">
                <img src="@/assets/images/nodata.png" alt="">
                <p class="fColor2 ft18">暂无数据</p> 
            </div>
        </div>
        <div class="content" v-show="isUrl==1">
            <ul class="list-title fColor2 ft12 clear">
                <li class="fl w15">委托时间</li>
                <li class="fl w10">委托方式</li>
                <li class="fl w10">方向</li>
                <li class="fl w10">委托价</li>
                <li class="fl w10">委托量</li>
                <li class="fl w14">委托总额</li>
                <li class="fl w12">已成交</li>
                <li class="fl w10">交易所</li>
                <li class="fl w8 tr">账户</li>
            </ul>
            <div class="container scroll" v-if="hisList.length>0">
                <ul class="list-item fColor1 ft12">
                    <li v-for="item in hisList" class="clear">
                        <span class="fl w15">{{item.create_time}}</span>
                        <span class="fl w10">自助委托</span>
                        <span class="fl w10" :class="{'green': item.typeInfo == 'in'}">{{item.typeInfo=='in'?'买入':'卖出'}}</span>
                        <span class="fl w10">{{item.price}}</span>
                        <span class="fl w10">{{item.number}}</span>
                        <span class="fl w14">{{item.price * item.number}}</span>
                        <span class="fl w12">是</span>
                        <span class="fl w10">imtoken</span>
                        <span class="fl w8 tr curPer ceilColor">{{item.account_number}}</span>
                    </li>
                </ul>
                <div class="getmore tc fColor1 ft14 mt10 curPer" @click="getMore" v-if="!loading && hisList.length>12">{{more}}</div>
                <div class="tc" v-if="loading">
                    <img src="@/assets/images/loading.gif" alt="" class="lodw20">
                    <p class="ft12 baseColor">加载中...</p>
                </div>
            </div>
            <div class="no_data tc" v-if="hisList.length<=0">
                <img src="@/assets/images/nodata.png" alt="">
                <p class="fColor2 ft18">暂无数据</p>   
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name:"entrust",
    data (){
        return{
            address:'',
            isChoosed:0,
            isUrl:0,
            page:1,
            url:'entrust',
            type:'in',
            more:'加载更多',
            loading:false,
            urlList:[{title:"当前委托",url:'entrust'},{title:"历史委托",url:"entrustlog"}],
            wayList:[{title:"买入",type:"in"},{title:"卖出",type:"out"}],
            enList:[],
            hisList:[]
        }
    },
    created(){
        this.address = localStorage.getItem('address') || '';
    },
    methods:{
        changeType(index,url){
           this.isUrl=index;
           this.url=url;
           this.page=1;
           this.more="加载更多"
        //    this.getdata();
        },
        wayChoose(index,type){
            var that=this;
            this.page=1;
            this.type = type;
            this.more="加载更多";
            this.isChoosed=index;
            // this.getdata();
        },
        getMore(){
            this.page = ++this.page;
            this.loading=true;
            // console.log(this.page)
            // this.getdata();
        },
        revoke(id){
            var that=this;
            layer.confirm('确认要删除吗？',['确定','取消'],
                ()=>{
                    var id = id;
                    that.$http({
                        url: '/api/' + 'transaction/revoke',
                        method:'post',
                        data:{
                            address:that.address,
                            type:that.type,
                            id:id
                        }
                    }).then(res=>{
                        res = res.data;
                        console.log(res)
                        if(res.type  === 'ok'){
                            layer.msg(res.message)
                            // that.getdata();
                        }else{
                            layer.msg(res.message);
                        }
                    }).catch(error=>{
                        // console.log(error)
                    })
                },
            )
        },
        getdata(){
            var type= this.type;
            var url = this.url;
            var page = this.page;
            // console.log(type,url,page)
            this.$http({
            url: '/api/' + 'transaction/' +url,
            method:'post',
            data:{
                address:this.address,
                type:type,
                page:page
            }
            }).then(res=>{
                res = res.data;
                this.loading=false;
                if(url=="entrust"){
                //    console.log(res.message.data);
                   if(page==1){
                       this.enList = res.message.data;
                   }else{
                       var newEist = res.message.data;
                       if(newEist.length<=0){
                           this.more="没有更多数据了...";
                           return;
                       }else{
                           this.enList=this.enList.concat(newEist)
                       }
                        conaole.log(this.enList)
                   }
                     for(var i in this.enList){
                       this.enList[i].typeInfo=this.type;
                   } 
                }else{
                //    console.log(res.message.data.data);
                   if(page==1){
                      this.hisList=res.message.data.data; 
                   }else{
                      var newHist = res.message.data.data; 
                       if(newHist.length<=0){
                           this.more="没有更多数据了...";
                           return;
                       }else{
                          this.hisList= this.hisList.concat(newHist);
                       }
                    //   console.log(this.hisList)
                   }
                   for(var i in this.hisList){
                       this.hisList[i].typeInfo=this.type;
                   }
                }
            }).catch(error=>{
                console.log(error)
            })
        }
    },
    mounted(){
        var that = this;
        // that.getdata();
    }
    
}
</script>
<style scoped>
.title{height: 48px;line-height: 46px;padding: 0 40px 0 30px;background-color: #181b2a;}
.tab_title{display: inline-block;line-height: 46px;height: 46px;}
.tab_title span{cursor: pointer;}
.tab_title span:not(:last-child) {margin-right: 40px;}
.content{padding: 0 40px 0 30px;height: 300px;}
.list-title{line-height: 40px; border-bottom: 1px solid #303b4b;height: 40px;}
.no_data{padding: 50px 0;}
.container{height: 260px;overflow: auto;}
.list-item li{line-height: 30px;}
.list-item li span{display: inline-block;float: left;}
.list-item li span:nth-child(3){color:#cc4951;}
.list-item li:hover{background-color: #2b3648}
.list-item li span.green{color: #55a067}
</style>


