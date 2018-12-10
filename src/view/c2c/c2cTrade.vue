<template>
  <div id="c2c-box" class="flex">
    <div class="c2c-l">
        <left></left>
    </div>
    <div class="c2c-r">
      <!-- <div class="title-top flex ft20">
        <p v-for="(item,index) in topType" :class="{'active':index==current}" @click='changeType(index,item.type,item.title)'>{{item.title}}</p>
      </div> -->
      <div class="listbox">
        <div class="flex flextitle">
          <span>类型</span>
          <span class="tc">数量</span>
          <span class="tc">交易总额</span>
          <span class="tc">支付方式</span>
          <span class="tc">时间</span>
          <span class="tc">状态</span>
          <span class="tr">操作</span>
        </div>
        <ul>
          <li v-for="(item,index) in list" :key="index" class="flex alcenter curPer">
            <div class="flex alcenter">
              <p :class="['head',{'sell ': item.type =='buy'}]">{{item.type=='sell'?'购买':'出售'}}</p>
              <span class="currencyName ml5 blue">{{item.currency_name}}</span>
            </div>
            <div class="tc">
              <span>{{item.number || '0.00' | tofixed}}</span>
            </div>
            <div class="tc light_green">{{item.deal_money || '0.00' | tofixed}}</div>
            <div class="tc">
              <img v-if="item.way_name == '支付宝'" src="../../assets/images/zfb_icon.png" />
              <img v-if="item.way_name == '微信'" src="../../assets/images/wx_icon.png" />
              <img v-if="item.way_name == '1'" src="../../assets/images/bank_icon.png" />
            </div>
            <div class="tc">{{item.create_time}}</div>
            <div class="tc">
              <div v-if="item.is_sure==0">未完成</div>
              <div v-if="item.is_sure==1">已完成</div>
              <div v-if="item.is_sure==2">已取消</div>
              <div v-if="item.is_sure==3">已付款</div>
            </div>
            <div class="tr">
              <button class="btn" @click="getDetail(item.id)">详情</button>
            </div>
          </li>
          <div class="tc ft12 gray mt20 curPer" v-if="list.length>=10&&showmore" @click="getMore()">加载更多...</div>
        </ul>
      </div>
    </div>
    <!-- =========详情弹窗========== -->
    <div class="mask" v-if="showDetail">
      <div class="m-content">
        <div class="title">
          <div>详情</div>
          <div @click="showDetail = false">x</div>
        </div>
        <div v-if="detail.is_sure==0">
          <span>状态:</span><span>待付款</span>
        </div>
        <div v-if="detail.is_sure==1">
          <span>状态:</span><span>已完成</span>
        </div>
        <div v-if="detail.is_sure==2">
          <span>状态:</span><span>已取消</span>
        </div>
        <div v-if="detail.is_sure==3">
          <span>状态:</span><span>已付款</span>
        </div>
        <div v-if="detail.type=='sell'">
          <div>
            <span>卖家：</span><span>{{detail.seller_name}}</span>
          </div>
          <div>
            <span>付款信息：</span><span>{{detail.way_name}}</span>
          </div>
          <div>
            <span>账号：</span>
            <span v-if="detail.way_name=='支付宝'">{{detail.sell_cash_info.alipay_account}}</span>
            <span v-if="detail.way_name=='微信'">{{detail.sell_cash_info.wechat_account}}</span>
          </div>
          <div>
            <span>银行卡号：</span><span>{{detail.sell_cash_info.bank_name}}:{{detail.sell_cash_info.bank_account}}</span>
          </div>
          <div>
            <span>收款人：</span><span>{{detail.hes_realname}}</span>
          </div>
        </div>
        <div>
          <span>联系方式：</span><span>{{detail.seller_phone}}</span>
        </div>
        <div>
          <span>数量：</span><span>{{detail.number || '0.00' | tofixed}}</span>
        </div>
        <div>
          <span>单价：</span><span>{{detail.price || '0.00' | tofixed}}</span>
        </div>
        <div>
          <span>总额：</span><span>{{detail.deal_money || '0.00' | tofixed}}</span>
        </div>
        <div>
          <span>下单时间：</span><span>{{detail.create_time}}</span>
        </div>
        <div>
          <span>参考号:</span><span>{{detail.id}}</span>
        </div>
        <!-- btnc -->
        <div class="flex around btnbox mt20" v-if="detail.is_sure==0&&detail.type=='sell'">
          <div class="ceilorder tc" @click="ceilOrder(detail.id)">取消订单</div>
          <div class="surepay tc" @click="sureOrder(detail.id)">我已付款，点击确认</div>
        </div>
        <div class="mt20 btnbox" v-if="detail.is_sure==3&&detail.type=='buy'">
          <div class="surepay tc" @click="surePayed(detail.id)">确认已收款</div>
        </div>
      </div>            
    </div>
  </div>
</template>
<script>
import left from '@/view/c2c/leftc2c'
import Vue from 'vue'
	Vue.filter('circle', function (value) {
		return value.substring(0,1)
	})
export default {
    components:{left},
    data(){
      return{
        token:'',
        current:0,
        type:'sell',
        page:1,
        list:[],
        legal_id:'',
        classify:'求购',
        topType:[{'title':"求购","type":"buy"},{'title':"出售","type":"sell"}],
        showDetail:false,
        detail:[],
        showmore:true
      }
    },
    filters: {
    tofixed: function(val) {
      val = Number(val);
      return val.toFixed(2);
    },
    tofixedFour: function(val) {
      val = Number(val);
      return val.toFixed(4);
    }
  },
    created(){
        this.token = window.localStorage.getItem("token") || "";
        if (this.token == "") {
          this.$router.push("/components/login");
        };     
        this.getList();
    },
    methods:{
      changeType(index,type,title){
        this.current=index;
        this.classify=title;
        this.type=type;
        this.list=[];
        this.page=1;
        this.getList(type);
      },
      // 获取买入列表
      getList() {
        let i = layer.load();
        this.$http({
          url: "/api/c2c_user_deal?&page=" + this.page,
          method: "get",
          headers: { Authorization: this.token }
        }).then(res => {
          layer.close(i);
          if (res.data.type == "ok") {
            let listdata = res.data.message.data;
            console.log(listdata);
            if (listdata.length != 0) {
              this.list = this.list.concat(listdata);
              this.page += 1;
            }
            if(listdata.length<10){
              this.showmore=false
            }
          }
        });
      },
      // 加载更多
      getMore(){
        this.getList();
      },
      // 详情
      getDetail(id) {
        var i=layer.load();
        var that =this;
        console.log(this)
        this.$http({
          url: "/api/c2c_deal?id=" + id,
          headers: { Authorization: this.token }
        }).then(res => {
          console.log(res);
          layer.close(i);
          if (res.data.type == "ok") {
            console.log(res.data.message);
            this.detail=res.data.message;
            this.showDetail = true;
          }
        });
    },
    // 取消订单
    ceilOrder(id){
      var that = this;
      layer.confirm('确认取消交易？', {
        btn: ['确认','取消'] //按钮
      }, function(){
        that.orderCeil(id);
      }, function(){
        // layer.msg('取消成功');
      });
    },
    orderCeil(id){
      var that = this;
      var i=layer.load();
      this.$http({
        url: "/api/c2c/user_legal_pay_cancel",
        method: "post",
        data:{id:id},
        headers: { Authorization: this.token }
      }).then(res => {
        layer.close(i);
        console.log(res);
        if (res.data.type == "ok") {
          layer.msg(res.data.message);
          that.page=1;
          that.getList();
          that.showDetail = false;
        }else{
          layer.msg(res.data.message)
        }
      });
    },
    // 确认我已付款
    sureOrder(id){
      var that = this;
      layer.confirm('请确认您已向卖家付款,恶意点击将被冻结账户', {
        btn: ['确认','取消'] //按钮
      }, function(){
        that.orderSure(id);
      }, function(){
        // layer.msg('取消成功');
      });
    },
    orderSure(id){
      var that = this;
      var i=layer.load();
      this.$http({
        url: "/api/c2c/user_legal_pay",
        method: "post",
        data:{id:id},
        headers: { Authorization: this.token }
      }).then(res => {
        layer.close(i);
        console.log(res);
        if (res.data.type == "ok") {
          layer.msg(res.data.message);
          that.page=1;
          that.getList();
          that.showDetail = false;
        }else{
          layer.msg(res.data.message);
        }
      });
    },
    // 确认我已收款
    surePayed(id){
      var that = this;
      layer.confirm('请确认您已收买家付款信息', {
        btn: ['确认','取消'] //按钮
      }, function(){
        that.payedSure(id);
      }, function(){
        // layer.msg('取消成功');
      });
    },
    payedSure(id){
      var that = this;
      var i=layer.load();
      this.$http({
        url: "/api/c2c/legal_deal_user_sure",
        method: "post",
        data:{id:id},
        headers: { Authorization: this.token }
      }).then(res => {
        layer.close(i);
        console.log(res);
        if (res.data.type == "ok") {
          layer.msg(res.data.message);
          that.page=1;
          that.getList();
          that.showDetail = false;
        }else{
          layer.msg(res.data.message);
        }
      });
    }
  },
}
</script>
<style lang='scss'>
#c2c-box {
  margin: 10px 0 10px;
  color: #c7cce6;
  .ml5{margin-left: 5px}
  .c2c-r{
    .title-top {
      p{
        margin-right: 30px;
        padding: 5px 0;
        cursor: pointer;
      } 
    }
    .coin-select{
      p{
        margin-right: 10px;
        cursor: pointer;
      }
      .select{
        color: #7a98f7;
      }
    }
    .listbox{
      .flextitle{
        padding: 20px 0;
        border-bottom: 1px solid #242840;
        span{
          flex:1;
        }
      }
      li{
        padding: 10px 0;
        >div{
          flex: 1;
          // line-height: 36px;
        }
        .blue{
          color: #3b68bb;
          font-weight: bolder;
        }
        .light_green{
          color: #489972;
          font-weight: 600;
        }
        .head{
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 10px;
          background: #5D8CC2;
          color: #fff;
          text-align: center;
          font-size: 14px;
          line-height: 36px;
        }
        .sell{
          background: #e35744;
        }
        .btn{
          border-radius: 3px;
          color: white;
          background-color: #638BD4;
          cursor: pointer;
          min-height: 33px;
          min-width: 80px;
          font-size: 14px;
          font-weight: 600;
          border: none;
        }
      }
      li:nth-child(even){
        background: #242840;
      }
      li:last-child{
        border-bottom: 1px solid #242840;
      }
    } 
  }

  > .c2c-l {
    margin: 0 10px;
    padding: 10px;
    background: #181b2a;
    width: 23%;
    li {
      padding: 0 20px;
      justify-content: space-between;
      cursor: pointer;
      .redColor {
        margin-left: 10px;
      }
      &:hover {
        background: rgb(38, 42, 66);
      }
    }
  }
  > .c2c-r {
    padding: 10px 30px;
    background: #181b2a;
    margin-right: 10px;
    width: 77%;
  }
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
    > .m-content {
      border-radius: 4px;
      background: #262a42;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 40px 20px 30px;
      max-height: 550px;
      width: 400px;
      > .title {
        position: absolute;
        top: 0;
        left: 0;
        text-align: center;
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        text-align: center;
        font-weight: 600;
        > div:last-child {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0 15px;
          cursor: pointer;
        }
      }
      > div:not(.title) {
        line-height: 32px;
      }
      div {
        span:first-child {
          margin-right: 5px;
          display: inline-block;
          width: 90px;
          // color: #ca4141;
        }
      }
      .btnbox{
        >div{
          padding: 3px 15px;
          background: #689CF1;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
        }
        .ceilorder{
          background: #9DB5C7;
        }
    }
    }
  }
}

</style>


