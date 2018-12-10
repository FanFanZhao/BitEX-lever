<template>
    <div class="klines">
        <div class="top-txt fColor1 ft14">{{leg_name}}/{{currency_name}}</div>
            <!-- <div class="kline">
            <div id="kline_container"></div>
            </div> -->
        <div>
    <iframe src="../../static/lib/kline.html" frameborder="0" width="100%" height="490" allowfullscreen scrolling="no" allowtransparency="true"></iframe>
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
      
      },
        mounted(){
          this.legal_id=localStorage.getItem('legal_id');
          this.currency_id=localStorage.getItem('currency_id');
          this.leg_name=localStorage.getItem('legal_name');
          this.currency_name=localStorage.getItem('currency_name');
        
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
      