<template>
    <div class='success'>
        <div class="box tc">
            <div class="imgbox">
                <img src="@/assets/images/successs.png" alt="" class="logo">
                <h5 class="white_gray mt10 ft14  white">恭喜您，支付成功</h5>
                
            </div>
            <div class="txtbox">
                <p class="ft18" style="padding-top:50px">订单已提交到后台,请您耐心等待！</p>
            </div>
            
                
            
        </div>
    </div>
</template>

<script>
export default {
  name:'success',
  data () {
    return {

    };
  },

}

</script>
<style lang='scss' scoped>
.box{width: 80%;margin: 0 auto;margin-top:50px;border-radius: 4px; }
.imgbox{padding: 80px 0;background: #0088fe;border-radius: 4px;}
.logo{width: 100px;}
.txtbox{height: 500px;background: #fff;}
</style>