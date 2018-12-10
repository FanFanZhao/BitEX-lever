<template>
	<div class="home flex">
		<div class="home-l">
      <div class="tv-box">
        <!-- <tv-top></tv-top> -->
        <tv></tv>
        <!-- <market></market> -->
      </div>
      <div class="entrusts">
        <div class="tab-entrust ">
          <span :class="{active:whichEntrust == 'entrust'}" @click="whichEntrust = 'entrust'">当前委托</span>
          <span :class="{active:whichEntrust == 'hisentrust'}" @click="whichEntrust = 'hisentrust'">历史委托</span>
        </div>
        <div class="scroll">

          <div class="entrust-box" v-if="whichEntrust == 'entrust'">
            <entrust ></entrust>
          </div>
          <div class="histentrust-box" v-if="whichEntrust == 'hisentrust'">
            <hisentrust></hisentrust>
          </div>
        </div>
      </div>
    </div>
    <div class="home-r">
      <div class="home-r-t flex">
        <div class="exchage-box">
          <exchange></exchange>
        </div>
        <div class="complete-box">
          <complete></complete>
        </div>
      </div>
      <div class="home-r-b">
        <trade></trade>
      </div>
    </div>
	</div>
</template>

<script>
import indexHeader from "@/view/indexHeader";
import notice from "@/components/noticeList";
import deal from "@/view/deal";
import exchange from "@/view/exchange";
// import market from "@/view/market";
import trade from "@/view/trade";
import chart from "@/view/chart";
import entrust from "@/view/entrust";
import hisentrust from "@/view/hisentrust";
// import detail from "@/view/detail";
import currency from "@/view/currency";
import complete from "@/view/complete";
// import kline from "@/view/kline";
import tv from "@/view/tv";
// import TvTop from '../view/tvTop'
export default {
  name: "dealCenter",
  components: {
    indexHeader,
    load:1,
    notice,
    deal,
    exchange,
    // market,
    trade,
    chart,
    entrust,
    hisentrust,
    // detail,
    currency,
    complete,
    // TvTop,
    // kline,
    tv
  },
  data() {
    return {
      isRouterAlive:true,
      whichEntrust:'entrust'
    };
  },
  created() {
    this.address = localStorage.getItem("address") || "";
    
  
    // console.log(this.address)
  },
  methods:{
    
  },
  mounted(){
    // console.log('wejdewhbewjdbewjdhbcwj')
    // if(this.load==1){
    //   console.log(1111)
    //   window.location.reload();
    //   this.load=2;
    // }
   
  }
};
</script>

<style scoped lang="scss">
.home{
  margin-top: 3px;
  justify-content: space-between;
  height: 100%;
  >.home-l{
    width: calc(100% - 683px);
    >.entrusts{
      margin-top: 3px;
      padding: 0 15px;
      background: #181b2a;
      height: 385px;
      >.tab-entrust{
        color: rgba(255,255,255,.8);
        font-size: 14px;
        line-height: 1.6;
        height: 30px;
        span{
          margin-right: 14px;
          line-height: 30px;
          
        }
        .active{
          // border-bottom: 1px solid #ccc;
        }
      }
    }
  }
  >.home-r{
    
    width: 680px;
    >.home-r-t{
      justify-content: space-between;
      min-height: 220px;
      max-height: calc(100% - 360px);
      >div{
        width: 338px;
        background: #181b2a;
      }
    }
    >.home-r-b{
      margin-top: 3px;
      background: #181b2a;
      height: 360px;
    }
  }
}
</style>
