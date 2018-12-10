<template>
    <div class="entrust">
        <div class="title fColor1 topshadow">
            <!-- <div class="tab_title">
                <span>当前委托</span>
            </div> -->
            <div class="tab_title fl ft12">
                <span v-for="(way,index) in wayList" :class="{'active': index == isChoosed}" @click="wayChoose(index,way.url)">{{way.title}}</span>
            </div>
        </div>
        <div class="content">
            <ul class="list-title fColor2 ft12 flex">
                <li class="w14">时间</li>
                <li class="w10">交易对</li>
                <li class="w8">方向</li>
                <li class="w11">数量</li>
                <li class="w11">价格</li>
                <li class="w11">已成交</li>
                <li class="w11">未成交</li>
                <li class="w10">委托总额</li>
                <li class="w8 tr">操作</li>
            </ul>
            <div class="containers scroll" v-if="inList.length>0">
                <ul class="list-item fColor1 ft12">
                    <li v-for="(item,index) in inList" class="clear">
                        <span class="fl w14">{{item.create_time}}</span>
                        <span class="fl w10">{{item.currency_name}}/{{item.legal_name}}</span>
                        <span :class="['fl','w8',{'green':type == 'in'}]">{{type=='in'?'买入':'卖出'}}</span>
                        <span class="fl w11">{{item.total_number}}</span>
                        <span class="fl w11">{{item.price}}</span>
                        <span class="fl w11">{{(item.complete_number-0).toFixed(5)}}</span>
                        <span class="fl w11">{{item.number}}</span>
                        <span class="fl w10">{{(item.total_money-0).toFixed(5)}}</span>
                        <span class="fl w8 tr curPer ceilColor" @click="revoke(index,item.id)">撤销</span>
                    </li>
                </ul>
                <div class="getmore tc fColor1 ft14 mt10 curPer pdb20" @click="getData('more')" v-if="!loading && inList.length>8">{{more}}</div>
                <div class="tc pdb20" v-if="loading">
                    <img src="@/assets/images/loading.gif" alt=""  class="lodw20">
                    <p class="ft12 baseColor">加载中...</p>
                </div>
            </div>
            <div class="no_data tc" v-if="inList.length<=0 && !loading">
                <img src="@/assets/images/nodata.png" alt="">
                <p class="fColor2 ft18">暂无数据</p> 
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "entrust",
  data() {
    return {
      isshow: false,
      address: "",
      isChoosed: 0,
      isUrl: 0,
      page: 1,
      url: "transaction_in",
      type: "in",
      more: "加载更多",
      loading: false,
      urlList: [{ title: "当前委托" }],
      wayList: [
        { title: "买入", url: "transaction_in" },
        { title: "卖出", url: "transaction_out" }
      ],
      inList: []
    };
  },
  created() {
    this.token = localStorage.getItem("token") || "";
  },
  
  methods: {
    // 类型切换
    wayChoose(index, url) {
      var that = this;
      
      // if(index ==2){
      //     that.isshow = true;
      // }else{
      //     that.isshow = false;
      //     that.getData();
      // }
      // console.log(url)
      that.inList = "";
      that.page = 1;
      that.url = url;
      // console.log(that.url)
      if (url == "transaction_in") {
        that.type = "in";
      } else if (url == "transaction_out") {
        that.type = "out";
      } else {
        that.type = "all";
      }
      that.getData();
      that.more = "加载更多";
      that.isChoosed = index;
    },

    // 撤销
    revoke(indexs, id) {
      // console.log(indexs);

      var that = this;
      var id = id;
      var indexs = indexs;
      var type = that.type;
      layer.open({
        content: "您确定要撤销吗？",
        btn: ["确定", "取消"],
        yes: function(index) {
          var i = layer.load();
          that
            .$http({
              url: "/api/" + "transaction_del",
              method: "post",
              data: {
                id: id,
                type: type
              },
              headers: { Authorization: that.token }
            })
            .then(res => {
              // console.log(res)
              layer.close(i);
              if (res.data.type == "ok") {
                console.log(indexs);
                that.inList.splice(indexs, 1);
                eventBus.$emit("tocel", "celbuy");
                layer.msg(res.data.message);
              } else {
                layer.msg(res.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    getData(more) {
      var that = this;
      if(that.token == ''){
        return;
      }
      var cur_id = window.localStorage.getItem("legal_id_cur");
      var url = that.url;
      if(!more){that.page=1}
      var page = that.page;
      that.loading = true;
      this.$http({
        url: "/api/" + url,
        method: "post",
        data: { page: page, currency_id: cur_id },
        headers: { Authorization: that.token }
      })
        .then(res => {
          // console.log(res)
          that.loading = false;
          // console.log(url)
          if (res.data.type == "ok") {
            // console.log(res.data.message.list)
            var list = res.data.message.list;
            if (more) {
              if (list.length == 0) {
                that.more = "没有更多数据了";
              } else {
                that.inList = that.inList.concat(list);
              }
              that.page += 1;
            } else {
              this.inList = list;
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
    eventBus.$on("tocel", function(data) {
      console.log(data);
      if (data) {
        that.getData();
      }
    });
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
/* .content{height: 300px;} */
.list-title {
  line-height: 40px;
  border-bottom: 1px solid #303b4b;
  height: 40px;
  width: 100%;
}

.no_data {
  padding: 50px 0;
}
.containers {
  height: 270px;
  overflow: auto;
}
.list-item li {
  line-height: 30px;
}
.list-item li span {
  display: inline-block;
}
.list-item li span:nth-child(3) {
  color: #cc4951;
}
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


