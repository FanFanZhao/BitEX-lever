<template>
  <div class="wrap">
    <ul class="list_head ft14">
      <li>
        <span>时间</span>
        <span>价格</span>
        <span>交易量</span>
        <span>操作</span>
      </li>
    </ul>
    <ul class="list_content fColor1 ft12">
      <li v-for="(item,index) in list_content" :key="index">
        <span>{{item.time}}</span>
        <span>{{item.price | tofixedFour}}</span>
        <span>{{item.number | tofixed}}</span>
        <span class="red" @click="pingcang(item.id)">平仓</span>
      </li>
    </ul>
    <p class="more" @click="load_more">{{more}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      legal_id: "",
      currency_id: "",
      list_content: [],
      page: 1,
      more: "加载更多"
    };
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
  created() {
    this.legal_id = localStorage.getItem("legal_id");
    this.currency_id = localStorage.getItem("currency_id");
    this.init();
  },
  methods: {
    init() {
      this.more = "加载中...";
      this.$http({
        url: "/api/" + "lever/dealall",
        method: "post",
        data: {
          legal_id: this.legal_id,
          currency_id: this.currency_id,
          page: this.page
        },
        headers: { Authorization: localStorage.getItem("token") }
      })
        .then(res => {
          if (res.data.type == "ok") {
            this.more = "加载更多";
            this.list_content = this.list_content.concat(
              res.data.message.order.data
            );
            if (res.data.message.order.data.length == 0) {
              this.more = "没有更多了...";
            }
          } else {
            layer.msg(res.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    pingcang(id) {
      let that = this;
      layer.confirm("确定平仓？", function() {
        that.$http({
            url: "/api/" + "lever/close",
            method: "post",
            data: {
              id: id
            },
            headers: { Authorization: localStorage.getItem("token") }
          })
          .then(res => {
            if (res.data.type == "ok") {
              layer.msg(res.data.message);
              location.reload();
            } else {
              layer.msg(res.data.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    load_more() {
      this.page++;
      this.init();
    }
  }
};
</script>
<style scoped>
.wrap {
  min-height: 500px;
  background: #181b2a;
  width: 80%;
  margin: 30px auto;
  padding: 30px;
}
ul li {
  padding: 8px 0;
}
ul li span {
  width: 24%;
  display: inline-block;
  text-align: center;
}
.list_head {
  color: #637085;
  border-bottom: 1px solid #2e333c;
}
.red {
  color: #cc4951;
  cursor: pointer;
}
.more {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
