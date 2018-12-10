<template>
    <div  class="account-main accountMessage">
        <div class="account-title">
            <span class="checkAll curPer"><input type="checkbox" class="curPer"></span>
            <span class="ml10 curPer">全选</span>
            <span class="baseColor fr curPer">清空消息</span>
        </div>
        <ul class="fColor1 hide">
            <li class="clear">
                <div class="fl curPer">
                    <input type="checkbox" class="checkbox">
                </div>
                <div class="ml25">
                    <span>注册成功</span>
                    <span class="fColor2 fr ft4">2018-08-03 11:10:21</span>
                    <p class="mt15 ft14 fColor2">恭喜您，注册成功！成为【INVESTDIGITAL LIMITED】一名用户。</p>
                </div>
            </li>
        </ul>
        <div class="no_data tc">
            <img src="@/assets/images/nodata.png" alt="">
            <p class="fColor2 ft18">暂无消息</p> 
        </div>
    </div>
</template>
<script>
export default {
    name:"accountMessage",
    data (){
        return{

        }
    }
}
</script>
<style lang="scss" scoped>
.accountMessage{
    .account-title{
       padding-left: 20px;
       padding-right: 12px;
       .checkAll{
           position: relative;
           top: 2px;
       }
    }
    ul{
        padding: 0 20px;
        li{
            border-bottom: 1px solid #303b4b;
            padding: 28px 0;
            .checkbox{
                position: relative;
                top: 2px;
            }
        }
    }
    .no_data{
        padding: 50px 0;
    }
}
</style>



