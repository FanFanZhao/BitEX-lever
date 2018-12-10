<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$http({
      url: "/api/" + "currency/quotation_new",
      method: "get",
      data: {},
      headers: { Authorization: localStorage.getItem("token") }
    })
      .then(res => {
        console.log(res);
        if (res.data.type == "ok") {
          this.tabList = res.data.message;
          var msg = res.data.message;
          var arr_quota = [];
          for (var i = 0; i < msg.length; i++) {
            arr_quota[i] = msg[i].quotation;
          }
          if (!window.localStorage.getItem("downUp")) {
            window.localStorage.setItem("downUp", arr_quota[0][0].change);
          }
          if (!window.localStorage.getItem("legal_id_cur")) {
            window.localStorage.setItem(
              "legal_id_cur",
              arr_quota[0][0].currency_id
            );
          }
          if (
            !localStorage.getItem("legal_id") &&
            !localStorage.getItem("currency_id") &&
            !localStorage.getItem("legal_name") &&
            !localStorage.getItem("currency_name")
          ) {
            window.localStorage.setItem(
              "legal_id",
              msg[0].quotation[0].legal_id
            );
            window.localStorage.setItem(
              "currency_id",
              msg[0].quotation[0].currency_id
            );
            window.localStorage.setItem(
              "legal_name",
              msg[0].quotation[0].legal_name
            );
            window.localStorage.setItem(
              "currency_name",
              msg[0].quotation[0].currency_name
            );
            var symbol =
              msg[0].quotation[0].currency_name +
              "/" +
              msg[0].quotation[0].legal_name;
            window.localStorage.setItem(
              "shareNum",
              msg[0].quotation[0].lever_share_num
            );
            // var priceScale=Math.pow(10,5);
            var priceScale = 100000;
            window.localStorage.setItem("priceScale", priceScale);
            window.localStorage.setItem("symbol", symbol);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style lang='scss'>
#app {
  .el-slider__runway {
    background-color: #2e3244;
  }
}
</style>
