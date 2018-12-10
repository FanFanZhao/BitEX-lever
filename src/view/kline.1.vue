<template>
        <div class="klines">
          <div class="top-txt fColor1 ft14">{{leg_name}}/{{currency_name}}</div>
          <div class="kline">
            <div id="kline_container"></div>
          </div>
          
        </div>
      </template>
      
      <script>
      import Vue from 'vue'
      export default {
        inject:['reload'],
        name: 'kline',
        data () {
          return {
            legal_id:'',
            currency_id:'',
            leg_name:'',
            currency_name:"",
            Kline:new Kline(),
            dateses:[]

          }
        },
        created(){
            this.token = localStorage.getItem('token') || '';
        },
        methods:{
          king(){
              var _that =this;
              _that.Kline.element="#kline_container";
              _that.Kline.width=$(".kline").width();
              _that.Kline.height=490;
              _that.Kline.theme='dark'; // light/dark
              _that.Kline.language='zh-cn'; // zh-cn/en-us/zh-tw
              _that.Kline.ranges=["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"],
              _that.Kline.symbol="BTC/coin4";
              _that.Kline.symbolName="COIN5_COIN4";
              _that.Kline.type="poll"; 
              _that.Kline.url='http://www.2kex.com/api/deal/info';
              _that.Kline.limit=1000;
              _that.Kline.intervalTime=50000;
              _that.Kline.debug=true;
              _that.Kline.showTrade=false;
              _that.Kline.onResize=function(width, height) {
                  console.log("chart resized=" + width + " " + height);
              }
            // var kline = new Kline({
            //   element: "#kline_container",
            //   width: $(".kline").width(),
            //   height: 490,
            //   theme: 'dark', // light/dark
            //   language: 'zh-cn', // zh-cn/en-us/zh-tw
            //   ranges: ["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"],
            //   symbol: "BTC/coin4",
            //   symbolName: "COIN5_COIN4",
            //   type: "poll", // poll/socket
            // //   url: "../../static/lib/mock.json",
            // //   datas:{id:123},
            //   url: 'http://ice.adminchao.com/api/deal/info',
            //   datas:{
            //     legal_id:_that.legal_id,
            //     currency_id :_that.currency_id,
            //     type: 1
            //   },
            //   limit: 1000,
            //   intervalTime: 50000,
            //   debug: true,
            //   showTrade: false,
            //   onResize: function(width, height) {
            //       console.log("chart resized: " + width + " " + height);
            //   }
            // })

            // _that.Kline.draw();  
          },
      },
        mounted(){
          this.legal_id=localStorage.getItem('legal_id');
          this.currency_id=localStorage.getItem('currency_id');
          this.legal_name=localStorage.getItem('legal_name');
          this.currency_name=localStorage.getItem('currency_name');
          this.king();
          var that = this;
          that.dateses=[];
          // eventBus.$on("toExchange0", function(data0) {
          //   console.log(data0);
            // that.legal_id = that.currency_id,
            // that.currency_id = that.legal_id;
            // that.currency_name = data0.currency_name;
            // that.leg_name = data0.leg_name;
            that.Kline.datas={
              legal_id:that.currency_id,
              currency_id :that.legal_id,
              type:1
            };
            that.Kline.draw(); 
          // });
          // eventBus.$on('toTrade', function (data) {
          //     if(data){
          //       that.currency_id =  data.legal_id,
          //       that.legal_id =data.currency_id;
          //       that.currency_name =  data.currency_name,
          //       that.leg_name = data.leg_name;
          //       that.Kline.datas={
          //         legal_id:that.legal_id,
          //         currency_id :that.currency_id,
          //         type:1
          //       };
          //       that.Kline.draw(); 
          //       that.Kline.init=false;
          //     }         
          // });
        }
      }
      </script>
      
      <!-- Add "scoped" attribute to limit CSS to this component only -->
      <style scoped>
      .top-txt{
        height: 40px;
        line-height: 40px;
        background: #181b2a;
        -webkit-box-shadow: 0 2px 6px rgba(0,0,0,.1);
        box-shadow: 0 2px 6px rgba(0,0,0,.1);
        padding: 0 15px;
      }
      .kline {
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          height: 490;
          position: relative;
      }
      </style>
      