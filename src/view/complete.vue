<template>
    <div class="detail">
        <div class="title fColor1 topshadow">
            <div class="inblock">
                <span>全站交易</span>
            </div>
        </div>
        <div class="content">
            <ul class="list-title fColor2 ft12 clear">
                <li class="fl w12">时间</li>
                <!-- <li class="fl w12">交易对</li> -->
                <li class="fl w12">价格</li>
                <li class="fl w12">交易量</li>
            </ul>
            <div class="containers scroll" v-if="deList.length>0">
                <ul v-for="itm in deList" class="list-item fColor1 ft12">
                    <li class="clear">
                        <span class="fl w12">{{itm.time | cutDate}}</span>
                        <!-- <span class="fl w12">{{itm.currency_name}} / {{itm.legal_name}}</span> -->
                        <span class="fl w14">{{itm.price}}</span>
                        <span class="fl">{{itm.number}}</span>
                    </li>
                </ul>
            </div>
            <!-- <div class="no_data tc" v-if="deList.length<=0">
                <img src="../assets/images/nodata.png" alt="">
                <p class="fColor2 ft18">暂无数据</p>   
            </div> -->
        </div>
    </div>
</template>
<script>
export default {
  name: "detail",
  data() {
    return {
      address: "",
      isChoosed: 2,
      new: false,
      wayList: ["买入", "卖出", "全部"],
      deList: [],
      legal_id: "",
      currency_id: "",
      leftName: "",
      rightName: ""
    };
  },
  created() {
    this.address = localStorage.getItem("address") || "";
  },
  filters:{
    cutDate(v){
      return v.substr(-8)
    }
  },

  methods: {
    wayChoosed(index) {
      this.isChoosed = index;
    },
    //全站交易记录
    complete(legals_id, currencys_id) {
      this.$http({
        url: "/api/" + "transaction/deal",
        method: "post",
        data: {
          legal_id: currencys_id,
          currency_id: legals_id
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          // console.log(res ,222)
          // layer.close(i);
          if (res.data.type == "ok") {
            let comp = res.data.message.complete;
            this.deList = comp;
            this.leftName = comp[0].currency_name;
            this.rightName = comp[0].legal_name;
            this.connect();
          } else {
            // layer.msg(res.data.message)
          }
        })
        .catch(error => {
          // console.log(error)
        });
    },
    connect() {
      var that = this;
      that.$socket.emit("login", localStorage.getItem("user_id"));
      that.$socket.on("deal_list", function(msg) {
        // console.log(msg);
        
        if (msg.type == "deal_list") {
          
          var complete = JSON.parse(msg.complete);
          var newlist = complete.filter(function(item) {
            return (
              item.currency_name == that.leftName &&
              item.legal_name == that.rightName
            );
          });
          if(newlist.length){
              that.deList = newlist;
          }
        }
        // console.log(msg);
      });
    }
  },
  mounted() {
    var that = this;
    this.legal_id = localStorage.getItem("legal_id");
    this.currency_id = localStorage.getItem("currency_id");
    that.complete(this.legal_id, this.currency_id);
    // this.currency_id=localStorage.getItem('currency_id');
    //   eventBus.$on('toTrade0', function (data0) {
    //         that.currency_id=data0.currency_id
    //         that.legal_id=data0.legal_id
    //         that.complete(data0.legal_id,data0.currency_id)
    //   });
    //    eventBus.$on('toTrade', function (data0) {
    //         that.currency_id=data0.currency_id
    //         that.legal_id=data0.legal_id
    //         that.complete(data0.legal_id,data0.currency_id)
    //   })
    // eventBus.$on('buyTrade', function (data) {
    //     that.connect();
    // });
  }
};
</script>
<style scoped>
.detail{
  height: 100%;
}
.content{
  height: 100%
}
.title {
  padding: 3px 20px;
  font-size: 14px;
  border-bottom: 1px solid #303b4b;
 
  /* height: 48px;
  line-height: 46px;
  padding: 0 40px 0 30px; */
  /* background-color: #181b2a; */
}
.tab_title {
  display: inline-block;
  line-height: 46px;
  height: 46px;
}
.tab_title span {
  cursor: pointer;
}
.tab_title span:not(:last-child) {
  margin-right: 40px;
}
.containers{
  height: calc(100% - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}
.list-title {
  line-height: 25px;
  /* border-bottom: 1px solid #303b4b; */
  /* height: 35px; */
}
.list-title li {
  width: 33.33%;
  text-align: center;
}
.no_data {
  padding: 50px 0;
}
.containers {
  /* height: 260px; */
  overflow: auto;
}
.list-item li {
  line-height: 1.6;
  display: flex;
}
.list-item li span {
  display: inline-block;
  float: left;
  width: 33.3%;
  text-align: center;
}

.list-item li:hover {
  background-color: #2b3648;
}
.list-item li span.green {
  color: #55a067;
}
</style>


