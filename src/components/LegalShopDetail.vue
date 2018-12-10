<template>
  <div id="legal-shop-detail">
    <div class="top flex bgf8">
      <div class="top-t flex bod_rc">
        <div class="logo">k</div>
        <div>
          <div>{{info.name}}</div>
          <div>注册时间：{{info.create_time}}</div>
        </div>
      </div>
      <div class="top-b flex">
        <div>
          <div>{{info.total}}</div>
          <div>总成单</div>
        </div>
        <div>
          <div>{{info.thirtyDays}}</div>
          <div>30日成单</div>
        </div>
        <div>
          <div>{{info.done}}</div>
          <div>完成单</div>
        </div>
        <div>
          <div>{{rate}}</div>
          <div>完成率</div>
        </div>
      </div>
      <div class="submit flex">
        <div @click="fb">发布</div>
      </div>
    </div>
    <div class="md flex bgf8">
      <div>
        <span>邮箱认证</span>
        <img v-if="info.prove_email == 1" src="../assets/images/success.png" alt="">
        <img v-else src="../assets/images/icon_error.png" alt="">
      </div>
      <div>
        <span>手机</span>
        <img v-if="info.prove_mobile == 1" src="../assets/images/success.png" alt="">
        <img v-else src="../assets/images/icon_error.png" alt="">
      </div>
      <div>
        <span>实名认证</span>
        <img v-if="info.prove_real == 1" src="../assets/images/success.png" alt="">
        <img v-else src="../assets/images/icon_error.png" alt="">
      </div>
      <div>
        <span>高级认证</span>
        <img v-if="info.prove_level == 1" src="../assets/images/success.png" alt="">
        <img v-else src="../assets/images/icon_error.png" alt="">
      </div>
    </div>
    <div class="list bgf8">
      <div class="tab">
        <div class="flex">
          <div>类型：</div>
          <div>
          <span  :class="{'now':filterPms.type == 'sell'}" @click="filterPms.type = 'sell';getList()">我的出售</span>
          <span :class="{'now':filterPms.type == 'buy'}" @click="filterPms.type = 'buy';getList()">我的求购</span>
          </div>
        </div>
        <div class="flex">
          <div>状态：</div>
          <div>
            <span  :class="{'now':filterPms.wasDone == false}" @click="filterPms.wasDone = false;getList()">未完成</span>
          <span :class="{'now':filterPms.wasDone == true}" @click="filterPms.wasDone = true;getList()">已完成</span>
          </div>
        </div>
      </div>
      <div class="ul-head">
        <div class="w10">币种</div>
        <div class="w15">数量</div>
        <div class="w25">限额</div>
        <div class="w10">单价</div>
        <div class="w10">支付方式</div>
        <div>操作</div>
      </div>
      <ul :class="[showWhich+'-box']" >
        <li v-for="(item,index) in list" :key="index" :class="[item.type == 'buy'?'buy-item':'sell-item']" class="bod_bc">
          <div class="w10">{{item.currency_name}}</div>
          <div class="w15">{{item.surplus_number}}</div>
          <div class="w25">{{(item.limitation.min-0).toFixed(4)}}-{{(item.limitation.max-0).toFixed(4)}}</div>
          <div class="w10">{{item.price}}</div>
          <div class="w10">{{item.way_name}}</div>
          <div>
            <router-link tag="span" :to="{path:'/shopLegalRecord',query:{id:item.id}}">查看订单</router-link>
            <span @click="changeOrder('back_send',item.id)" v-if="item.is_done!=1">撤回</span>
            <span @click="changeOrder('error_send',item.id)" v-if="item.is_done!=1">异常</span>
            
          </div>
        </li>
      </ul>
      <div class="more" @click="getList(true)" v-if="list.length">加载更多</div>
      <div class="more" v-else>暂无更多</div>
    </div>
    <div class="submit-box" v-if="isShow">
      <div class="content">
        <p class="close" @click="close">X</p>
        <div class="tab">
          <div>请选择类型：</div>
         <!-- <div :class="{'now':true}">出售</div> -->
         <!-- <div>求购</div> -->
         <div :class="{'now':index==current}" v-for="(item,index) in typeList" @click="changeType(index,item.type)">{{item.name}}</div>
        </div>
        <div class="flex">
          <span>币种：</span>
          <span>{{info.currency_name}}</span>
        </div>
        <div class="flex">
          <span>支付方式：</span>
          <select name="coins" id="method" class="flex2 ptb10 plr10 bd" v-model="way">
            <option value="-1">请选择</option>
            <option value="ali_pay"> 支付宝</option>
            <option value="we_chat">微信</option>
            <option value="bank">银行卡</option>
          </select>
        </div>
        <div class="flex">
          <span>单价：</span>
          <input type="text" name="" id="" v-model="price">
        </div>
        <div class="flex">
          <span>数量：</span>
          <input type="text" v-model="total_number">
        </div>
        <div class="flex">
          <span>最小交易数量：</span>
          <input type="text" v-model="min_number">
        </div>
        <div class="btn" @click="fabu">发布</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current:0,
      token: "",
      sellerId: "",
      info: { lists: { data: [] } },
      showWhich: "none",
      isShow:false,
      showDetail: false,
      detail: { money: "", num: "" },
      timer: "",
      rate:'--',
      filterPms: { id: "", page: 1, wasDone: false, type: "sell" },
      list: [],
      submitPms:{type:'sell'},
      typeList:[{name:'出售',type:'sell'},{name:'求购',type:'buy'}],
      type:'sell',
      way:-1,
      price:'',
      total_number:'',
      min_number:'',

    };
  },
  created() {
    this.token = window.localStorage.getItem("token") || "";
    if (this.token) {
      this.sellerId = this.$route.query.id || "";
      this.getSellerInfo();
      this.getList();
    }
  },
  methods: {
    // 切换发布类型
    changeType(index,type){
      this.current=index;
      this.type=type;
      console.log(this.type)
    },
    // 获取默认数据
    getSellerInfo(more) {
      this.showWhich = "none";
      if (!more) {
        this.page = 1;
      }
      let i = layer.load();
      this.$http({
        url: "/api/seller_info",
        params: {
          id: this.sellerId,
          page: 1
        },
        headers: { Authorization: this.token }
      }).then(res => {
        layer.close(i);
        // console.log(res);
        if (res.data.type == "ok") {
          this.info = Object.assign({}, res.data.message);
          var result=(res.data.message.done/res.data.message.total*100).toFixed(2);
          this.rate=(result=='NaN'?'0.00':result+'%');
          this.currency_id = res.data.message.currency_id;
        }
      });
    },
    getList(more = false) {
      var pms = {};
      if (!more) {
        this.filterPms.page = 1;
      }
      pms.page = this.filterPms.page;
      if (this.filterPms.type != "none") {
        pms.type = this.filterPms.type;
      }
      if (this.filterPms.wasDone != "none") {
        pms.was_done = this.filterPms.wasDone;
      }
      pms.id = this.sellerId;
      var i = layer.load();
      this.$http({
        url: "/api/seller_trade",
        params: pms,
        headers: { Authorization: this.token }
      }).then(res => {
        layer.close(i);
        if (res.data.type == "ok") {
          var msg = res.data.message;
          if (more) {
            if (msg.data.length) {
              this.list = msg.data.concat(this.list);
              this.filterPms.page += 1;
            } else {
              layer.msg("没有更多了");
            }
          } else {
            this.list = msg.data;
            if (msg.data.length) {
              this.filterPms.page += 1;
            }
          }
        }
      });
    },
    changeOrder(url, id) {
      this.$http({
        url: "/api/" + url,
        method: "post",
        data: { id: id },
        headers: { Authorization: this.token }
      }).then(res => {
        if (res.data.type == "ok") {
          layer.msg(res.data.message);
          this.getList();
        }else{
          layer.msg(res.data.message);
        }
      });
    },
    setDetail(item) {
      this.detail = Object.assign({ which: "money", money: "", num: "" }, item);
      this.showDetail = true;
      var time = 60;
      var that = this;
      that.timer = setInterval(function() {
        time--;
        that.$refs.remainTime.innerHTML = time;
        if (time == 0) {
          that.showDetail = false;
          clearInterval(that.timer);
        }
      }, 1000);
    },
    buySell() {
      // this.detail = Object.assign({which:'money'},item)
      // var value = this.detail.which == 'money'?detail.money:detail.num;
      var value = "";
      if (this.detail.which == "money") {
        value = this.detail.money;
        if (value == "") {
          return;
        } else if (value - 0 - this.detail.limitation.min < 0) {
          layer.msg("不能低于最低限额");
          return;
        } else if (value - 0 - this.detail.limitation.max > 0) {
          layer.msg("不能超出最大限额");
          return;
        }
      } else {
        value = this.detail.num;
        if (value == "") {
          return;
        } else if (value > this.detail.surplus_number) {
          layer.msg("不能超出最大数量");
          return;
        }
      }
      this.$http({
        url: "/api/do_legal_deal",
        method: "post",
        data: { means: this.detail.which, value: value, id: this.detail.id },
        headers: { Authorization: this.token }
      }).then(res => {
        this.showDetail = false;
        if (res.data.type == "ok") {
          var message = res.data.message;
          layer.msg(message.msg);
          if (this.detail.type == "sell") {
            this.$router.push({
              path: "/legalPay",
              query: { id: msg.data.id }
            });
          } else {
            this.$router.push({
              path: "/components/payCannel",
              query: { id: msg.data.id }
            });
          }
        }
      });
    },
    cancel() {
      clearInterval(this.timer);
      this.showDetail = false;
    },
    // 发布弹层
    fb(){
      this.isShow=true;
    },
    // 弹层关闭
    close(){
      this.isShow=false;
    },
    // 发布
    fabu(){
      var type = this.type;
      var way = this.way;
      var price = this.price;
      var total_number = this.total_number;
      var min_number = this.min_number;
      var currency_id = this.currency_id;
      if(way<0){
        return layer.msg('请先选择支付方式')
      }
      if(!price || price<=0){
        return layer.msg('请先输入单价')
      }
      if(!total_number||total_number<=0){
        return layer.msg('请先输入数量')
      }
      if(!min_number ||min_number<=0){
        return layer.msg('请先输入最小交易量')
      }
      console.log(type,way,price,total_number,min_number,currency_id)
      this.$http({
        url: "/api/" + 'legal_send',
        method: "post",
        data: { 
          type:this.type,
          way: this.way,
          price :this.price,
          total_number:this.total_number,
          min_number:this.min_number,
          currency_id :this.currency_id
         },
        headers: { Authorization: this.token },
      }).then(res => {
        if (res.data.type == "ok") {
          layer.msg(res.data.message);
          this.isShow=false
         
        }
      });
    }
  },
};
</script>

<style lang='scss'>
#legal-shop-detail {
  margin: 30px auto 0;
  width: 1200px;
  // background: #f8f8f8;
  line-height: 30px;
  > .top {
    // background: #f8f8f8;
    line-height: 36px;
    padding: 16px 30px;
    > .top-t {
      align-items: center;
      padding-right: 30px;
      // border-right: 1px solid #ccc;
      margin-right: 30px;
      > .logo {
        margin-right: 20px;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background: #2e1b85;
        text-align: center;
      }
    }
    > .top-b {
      > div {
        width: 100px;
        text-align: center;
      }
    }
    > .submit {
      align-items: center;
      justify-content: flex-end;
      > div {
        border-radius: 2px;
        margin-left: 30px;
        color: #fff;
        padding: 0 16px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        background: #2e1b85;
        cursor: pointer;
      }
    }
  }
  > .md {
    // background: #f8f8f8;
    padding: 16px 30px;
    > div {
      margin-right: 50px;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
  > .list {
    // background: #f8f8f8;
    margin-top: 20px;
    padding: 5px 30px 16px;
    > .tab {
      margin: 16px 0;
      > .flex {
        > div:first-child {
          width: 80px;
        }
      }
      span {
        margin-right: 20px;
        cursor: pointer;
      }
      .now {
        color: #2e1b85;
        font-weight: 600;
      }
    }
    > .ul-head {
      height: 30px;
      > div {
        // text-align: center;
        float: left;
      }
      > div:last-child {
        float: right;
      }
    }
    > ul {
      li {
        padding: 16px 0;
        height: 62px;
        // border-bottom: 1px solid #ddd;
        > div {
          float: left;
        }
        > div:last-child {
          float: right;
        }
        // > div:nth-child(3) {
        //   flex: 2;
        // }
        // > div:first-child {
        //   text-align: left;
        //   flex: 0.5;
        // }
        > div:last-child {
          // text-align: right;
          // display: flex;
          height: 30px;
          span {
            float: right;
            background: #2e1b85;
            padding: 0 12px;
            border-radius: 2px;
            color: #fff;
            cursor: pointer;
            font-size: 12px;
            margin-right: 5px;
          }
        }
      }
    }
    > .buy-box > .sell-item,
    .sell-box > .buy-item {
      display: none;
    }
    .more {
      padding: 20px 20px;
      text-align: center;
      cursor: pointer;
    }
  }
  > .submit-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    > .content {
      margin: 100px auto 0;
      border-radius: 4px;
      width: 440px;
      padding: 20px 30px 26px 30px;
      background: #fff;
      line-height: 30px;
      position: relative;
      .close{
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
      }
      >.tab{
        display: flex;
        >div{
          margin-right: 50px;

        }
        .now{
          font-weight: 600;
          padding-bottom: 3px;
          color: #2e1b85;
          border-bottom: 2px solid #2e1b85;
        }
      }
      >.btn{
        background: #2e1b85;
        color: #fff;
        border-radius: 2px;
        text-align: center;
        line-height: 40px;
      }
      > .flex {
        // display: flex;
        margin-bottom: 20px;
        span{
          width: 130px;
        }
        input,select{
          border-radius: 2px;
          border: 1px solid #ccc;
          padding: 0 16px;
          flex:1;
        }
      }
      > .tab {
        margin: 10px 0 20px;
        border-bottom: 1px solid #eee;
        span {
          margin-right: 20px;
        }
        cursor: pointer;
        > .selected {
          font-weight: bold;
          color: #2e1b85;
        }
      }
      > .inp {
        display: flex;
        border-radius: 2px;
        justify-content: space-between;
        border: 1px solid #ccc;
        padding: 3px 16px;
        span {
          padding-left: 10px;
          margin-left: 10px;
        }
        .all {
          border-left: 1px solid #ccc;
          font-weight: 600;
          cursor: pointer;
        }
      }
      > .tip {
        font-size: 12px;
        margin-top: 10px 16px;
        color: #2e1b85;
      }
      > .btns {
        justify-content: space-between;

        > div {
          width: 46%;
          text-align: center;
          border-radius: 2px;
          line-height: 40px;
          cursor: pointer;
        }
        > .cancel {
          background: #ccc;
        }
        > .ok {
          background: #2e1b85;
          color: #fff;
        }
      }
    }
  }
}
</style>
