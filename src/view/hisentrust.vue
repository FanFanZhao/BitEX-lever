<template>
    <div class="entrust">
        <!-- <div class="title fColor1 topshadow">
            <div class="tab_title">
                <span>历史委托</span>
            </div>
            
        </div> -->
        <div class="content">
            <ul class="list-title fColor2 ft12 clear">
                <li class="fl w18">时间</li>
                <li class="fl w10">交易对</li>
                <li class="fl w10">数量</li>
                <li class="fl w10">价格</li>
                <li class="fl w11">委托总额</li>
                <li class="fl w10">成交均价</li>
                <li class="fl w10">状态</li>
                <li class="fl w10">手续费</li>
                <li class="fl w8 tr">方向</li>
            </ul>
            <div class="containers scroll" v-if="comList.length>0">
                <ul class="list-item fColor1 ft12">
                    <li v-for="item in comList" class="clear">
                        <span class="fl w18">{{item.time}}</span>
                        <span class="fl w10">{{item.currency_name}}/{{item.legal_name}}</span>
                        <span class="fl w10">{{item.number}}</span>
                        <span class="fl w10">{{item.price}}</span>
                        <span class="fl w11">{{(item.price * item.number) | numFilter}}</span>
                        <span class="fl w10">{{item.price}}</span>
                        <span class="fl w10">已成交</span>
                        <span class="fl w10">{{item.type=='in'? item.in_fee:item.out_fee}}</span>
                        <span class="fl w8 tr" :class="item.type=='out'?'redColor':'green'">{{item.type=='in'?'买入':'卖出'}}</span>
                    </li>
                </ul>
                <div class="getmore tc fColor1 ft14 mt10 curPer pdb20" @click="getData('more')" v-if="!loading && comList.length>8">{{more}}</div>
                <div class="tc pdb20" v-if="loading">
                    <img src="@/assets/images/loading.gif" alt=""  class="lodw20">
                    <p class="ft12 baseColor">加载中...</p>
                </div>
            </div>
            <div class="no_data tc" v-if="comList.length<=0 && !loading">
                <img src="@/assets/images/nodata.png" alt="">
                <p class="fColor2 ft18">暂无数据</p> 
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "hisentrust",
  data() {
    return {
      address: "",
      isChoosed: 0,
      isUrl: 0,
      page: 1,
      url: "transaction_in",
      type: "in",
      more: "加载更多",
      loading: false,
      wayList: [
        { title: "买入", url: "transaction_in" },
        { title: "卖出", url: "transaction_out" },
        { title: "全部", url: "transaction_all" }
      ],
      comList: []
    };
  },
  created() {
    this.token = localStorage.getItem("token") || "";
  },
  wacth() {
    eventBus.$on("buyTrade", function(data) {
      console.log(data);
      if (data) {
        that.getData();
      }
    });
  },
  methods: {
    // 类型切换
    wayChoose(index, url) {
      var that = this;
      console.log(url);
      that.comList = "";
      that.page = 1;
      that.url = url;
      console.log(that.url);
      if (url == "transaction_in") {
        that.type = "in";
      } else {
        that.type = "out";
      }
      that.more = "加载更多";
      that.isChoosed = index;
      that.getData();
    },
    // 加载更多
    getMore() {
      this.page = ++this.page;
      console.log(this.page);
      this.getData();
    },
    getData(more) {
      var that = this;
      if(that.token == ''){
        return;
      }
      if(!more){that.page = 1};
      var page = that.page;
      that.loading = true;
      var cur_id = window.localStorage.getItem("legal_id_cur");
      this.$http({
        url: "/api/" + "transaction_complete",
        method: "post",
        data: { page: page, currency_id: cur_id },
        headers: { Authorization: that.token }
      })
        .then(res => {
          // console.log(res)
          that.loading = false;
          if (res.data.type == "ok") {
            // console.log(res.data.message.list)
            var list = res.data.message.list;

            if (more) {
              that.page += 1;
              if (list.length) {
                that.comList = that.comList.concat(list);
              } else {
                that.more = "没有更多数据了..";
              }
            } else {
                if(list.length){

                    that.comList = list;
                }
            }

            
          } 
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    var that = this;
    eventBus.$on("buyTrade", function(data) {
      console.log(data);
      if (data) {
        that.getData();
      }
    });
    that.getData();
    setInterval(function(){
        that.getData()
    },10000)
  }
};
</script>
<style scoped>
.title {
  height: 36px;
  line-height: 36px;
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
.content {
  height: 300px;
}
.list-title {
  line-height: 40px;
  border-bottom: 1px solid #303b4b;
  height: 40px;
}
.no_data {
  padding: 50px 0;
}
.containers {
  height: 290px;
  overflow: auto;
}
.list-item li {
  line-height: 30px;
}
.list-item li span {
  display: inline-block;
  float: left;
  height: 30px;
}
/* .list-item li span:nth-child(3){color:#cc4951;} */
.list-item li:hover {
  background-color: #2b3648;
}
.list-item li span.green {
  color: #55a067;
}
.pdb20 {
  padding-bottom: 20px;
}
.containers span {
  margin-left: 0;
}
</style>


