<template>
	<div class="nav_bar">
		<div class="content clear" style="height:60px">
			<div class="fl"><img src="@/assets/images/logo.png" class="navbar-logo" style="width:32px;position:relative;top:-2px;"></div>
			<ul  class="navbar-item fl mouseDefault ml20">
				<!-- <li  class="base" :class="{active:index==current}"  v-for="(tabs,index) in tabList" :key="index"  @click="goto(index,tabs.page)">{{tabs.title}}</li> -->
				<li  class="base" ><router-link to="/" exact>首页</router-link></li>
				<!-- <li  class="base" ><router-link to="/c2c">C2C交易</router-link></li> -->
				<li  class="base"><router-link to="/legalTrade">法币交易</router-link></li>
        <li  class="base"><router-link to="/leverdealCenter">合约交易</router-link></li>
        <li  class="base" v-if="isShow"><router-link to="/myLegalShops">我的商铺</router-link></li>
        <li  class="base"><router-link to="/finance">我的资产</router-link></li>
        <li  class="base"><router-link to="/noticeList">帮助中心</router-link></li>
        <li class="base downapp" @click="showapp">APP下载
          <div class="appcode tl" v-show="appshow">
            <span></span>
            <div class="app-left">
              <p class="code"><img src="@/assets/images/qrcode2.png" alt=""></p>
              <p class="texts">扫码下载</p>
            </div>
            <div class="app-right">
              <a href="http://www.965kj.net/mts.exe">
                <b><img src="../assets/images/windows.png" alt=""></b>
                <p class="texts"> <img src="../assets/images/down.png" alt=""> 点击下载</p>
              </a>
            </div>
            
          </div>
        </li>
			</ul>
			<div class="fr">
				<div class="account-box fl positionR curPer flex">
					<div class="msg_wrap">
					<div class="account_login fColor1 fl" @mouseover="mine_over" @mouseout="mine_out"  v-if="address.length>0">
						<img class="icon_img" src="@/assets/images/account.png" alt="">
						<span>{{account_number | hideFour}}</span>
						<img src="@/assets/images/arrow0.png" alt="">
					</div>
					</div>
					<div class=" order-choose ft14 fColor1" v-if="show2" @mouseover="order_over" @mouseout="order_out" >
						<p class="curPer" v-for="(item,index) in orderList" :key="index" @click="goto(null,item.page)">
							<img :src="item.src1" alt="">
							<img :src="item.src2" alt="">
							<span>{{item.title}}</span>
						</p>
					</div>
					<div class="account-choose mine ft14 fColor1" v-show="show3" @mouseover="mine_over" @mouseout="mine_out"  >
						<p class="curPer" v-for="(item,index) in accountList" :key="index" @click="goto(null,item.page)">
							<img :src="item.src1" alt="">
							<img :src="item.src2" alt="">
							<span>{{item.title}}</span>
						</p>
						<p class="curPer" @click="loginOut">
							<img src="@/assets/images/t0.png" alt="">
							<img src="@/assets/images/t1.png" alt="">
							<span>退出登录</span>
						</p>
					</div>
				</div>
				<div  class="fl login mr50" v-if="address.length<=0">
					<router-link :to="{ name: 'login'}">
						<span>登录</span>
					</router-link>
					<router-link :to="{ name: 'register'}">
						<span  class="ml20">注册</span>
					</router-link>
				</div>
			</div>
		</div>
	</div>

</template>
<script>
export default {
  name: "indexHeader",
  data() {
    return {
      appshow:false,
      address: "",
      account_number: "",
      assets: "资产",
      orders: "订单",
      isShow:false,
      show1: false,
      show2: false,
      show3: false,
      current: 0,
      extension_code: "",
      tabList: [],
      
      accountList: [
        {
          src1: require("@/assets/images/z0.png"),
          src2: require("@/assets/images/z1.png"),
          title: "账户设置",
          page: "accountSet"
        },
        {
          src1: require("@/assets/images/icon_news.png"),
					src2: require("@/assets/images/icon_news_s.png"),
          title: "交易日志",
          page: "transferLog"
        },
        {
          src1: require("@/assets/images/z0.png"),
          src2: require("@/assets/images/z1.png"),
          title: '收款设置',
          page:'userSetting',
        },
        {
          src1: require("@/assets/images/icon_mine.png"),
          src2: require("@/assets/images/icon_mine_s.png"),
          title: '身份认证',
          page:'authentication',
        },
        {
          src1: require("@/assets/images/s0.png"),
          src2: require("@/assets/images/s1.png"),
          title: "支付",
          page: "payment"
        },
      ],
      assetstList: [],
      orderList: []
    };
  },
  filters: {
    hideFour: function(value) {
      value = value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      return value;
    }
  },
  created() {

    
    
    this.address = localStorage.getItem("token") || "";
  
    // var address = this.address;
    // if (address != "") {
    //   this.$http({
    //     url: '/api/' + "user/getuserbyaddress",
    //     method: "post",
    //     data: {
    //       address: address
    //     }
    //   })
    //     .then(res => {
    //       res = res.data;
    //       if (res.type === "ok") {
    //         // console.log(res.message)
    //         this.account_number = res.message.account_number;
    //       } else {
    //         layer.msg(res.message);
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }

  },
  mounted() {
    this.account_number = localStorage.getItem('accountNum') || '';
    this.extension_code = localStorage.getItem('extension_code') || '';
    this.is_seller = window.localStorage.getItem("is_seller") || "";
    if(this.is_seller == 1){
      this.isShow = true;
    }
    eventBus.$on("seller", msg => {
      if(msg){
          this.is_seller = window.localStorage.getItem("is_seller") || "";
          if(this.is_seller == 1){
            this.isShow = true;
          }
      }
    });
    this.bus.$on("nav_name", name => {
      this.current = this.tabList.findIndex(
        val =>
          val.page === name || (val.children && val.children.includes(name))
      );
      // console.log(this.current);
    });
  },
  methods: {
    showapp(){
      this.appshow=!this.appshow
    },
    goto(index, name) {
      this.current = index;
      // console.log(index, name);
      
      this.bus.$emit('nav_name',name);
      if(name == 'userSetting'){
        this.$router.push('/userSetting')
      } else {

        this.$router.push({ name: name });
      }
    },
    gotoAccount(index,name){
      // this.current = index;
      // console.log(index, name);
      this.bus.$emit('nav_name',name);
      this.$router.push({ name: name });
    },
    loginOut() {
      // console.log("out");
      localStorage.removeItem("token");
      localStorage.removeItem("accountNum");
      localStorage.clear();
      this.$router.push('/components/login');
    },
    assets_over() {
      this.show1 = true;
    },
    assets_out() {
      this.show1 = false;
    },
    order_over() {
      this.show2 = true;
    },
    order_out() {
      this.show2 = false;
    },
    mine_over() {
      this.show3 = true;
    },
    mine_out() {
      this.show3 = false;
    }
  }
};
</script>

<style scoped lang='scss'>
.nav_bar {
  @include line-height(60px);
  width: 100%;
  min-width: 1200px;
  padding: 0 30px;
  background: #181b2a;
  .content {
    // width: 1200px;
    margin: 0 auto;
  }
  .router-link-active {
    color: #7a98f7;
  }
  .msg_wrap {
    display: flex;
    align-items: center;
    >div{
      margin: 0 10px;
    }
  }
  .icon_img {
    width: 15px;
  }
  .assets_icon_img,
  .order_icon_img {
    width: 20px;
    height: 20px;
  }
  .sp {
    line-height: normal;
    margin: 0 4px;
  }

  .navbar-logo {
    vertical-align: middle;
  }
  .account_login,
  .assets_item,
  .order_item {
    // width: 100px;
    font-size: 14px;
  }
  .assets_item,
  .order_item {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .account-choose {
    // display: none;
    cursor: default;
    position: absolute;
    top: 60px;
    right: -44px;
    z-index: 999;
    width: 188px;
    line-height: 40px;
    background-color: #262a42;
    z-index: 5000;
    border-radius: 3px;
    box-shadow: 0 0 2px 4px rgba(0, 0, 0, 0.2);
    p {
      padding-left: 20px;
      img {
        width: 14px;
        vertical-align: middle;
        margin-right: 8px;
        display: inline-block;
      }
      img:nth-child(2) {
        display: none;
      }
    }
    p:hover {
      color: #5697f4;
      background-color: #181b2a;
    }
    p:hover img:nth-child(2) {
      display: inline-block;
    }
    p:hover img:nth-child(1) {
      display: none;
    }
  }
  .asset-choose {
    // display: none;
    cursor: default;
    position: absolute;
    top: 60px;
    right: 156px;
    width: 188px;
    line-height: 40px;
    background-color: #262a42;
    z-index: 5000;
    border-radius: 3px;
    box-shadow: 0 0 2px 4px rgba(0, 0, 0, 0.2);
    p {
      padding-left: 20px;
      img {
        width: 14px;
        vertical-align: middle;
        margin-right: 8px;
        display: inline-block;
      }
      img:nth-child(2) {
        display: none;
      }
    }
    p:hover {
      color: #5697f4;
      background-color: #181b2a;
    }
    p:hover img:nth-child(2) {
      display: inline-block;
    }
    p:hover img:nth-child(1) {
      display: none;
    }
  }
  .order-choose {
    // display: none;
    cursor: default;
    position: absolute;
    top: 60px;
    right: 56px;
    width: 188px;
    line-height: 40px;
    background-color: #262a42;
    z-index: 5000;
    border-radius: 3px;
    box-shadow: 0 0 2px 4px rgba(0, 0, 0, 0.2);
    p {
      padding-left: 20px;
      img {
        width: 14px;
        vertical-align: middle;
        margin-right: 8px;
        display: inline-block;
      }
      img:nth-child(2) {
        display: none;
      }
    }
    p:hover {
      color: #5697f4;
      background-color: #181b2a;
    }
    p:hover img:nth-child(2) {
      display: inline-block;
    }
    p:hover img:nth-child(1) {
      display: none;
    }
  }
  .navbar-item {
    color: #cdd6e4;
    li {
      float: left;
      height: 60px;
      line-height: 60px;
      padding: 0 30px;
      display: block;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      color:#c7cce6;
      &.active {
        color:#7a98f7;
        border:none;
      }
    }
  }
  .login {
    color: #cdd6e4;
    margin-right: 50px;
    span {
      cursor: pointer;
    }
    .ml20 {
      margin-left: 20px;
    }
  }
}
.downapp{
  position: relative;
  .appcode{
    position: absolute;
    top: 50px;
    z-index: 10;
    left: -80px;
    width: 260px;
    background-color: #fff;
    height: 140px;
    border-radius: 4px;
    span{
        position: absolute;
        top: -20px;
        left: 130px;
        display: inline-block;
        width: 0;
        height: 0;
        border-width: 10px;
        border-style: solid;
        border-color:  transparent transparent #fff  transparent ;
    }
    .app-left{
      width: 130px;
      float: left;
      text-align: center;
      position: relative;
      .code{
        position: relative;
        top: 5px;
        left: 10px;
        img{
          width: 100px;
          height: 100px;
        }
        p:last-child{
          position: absolute;
          bottom: 0;
        }
      }
    }
    .app-right{
      float: right;
      width: 110px;
      text-align: center;
      margin-right: 10px;
      padding-right: 10px;
      margin-top:5px;
      p{
        top: -10px;
        img{
          width: 20px;
          position: relative;
          top: 4px;
          margin-top: 0;
        }
      }
      img{
        width: 40px;
        margin-top: 30px;
      }
      b{
        display: block;
        width: 100px;
        height: 100px;
        border: 1px solid #f7f6f6;
        text-align: center;
        top: 0;
        border-radius: 4px;
      }
    }
    .texts{
      position: relative;
      top: -30px;
      color: #333;
    }
    
  }
}

</style>
