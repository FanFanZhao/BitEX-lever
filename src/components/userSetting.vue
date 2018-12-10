<template>
    <div id="user-setting" class="flex">
        <div class="setting-l">
            <div class="setting-item">
                <!-- <div class="item-title">收款方式</div> -->
                <router-link to="/userSetting">收款方式</router-link>
            </div>
        </div>
        <div class="setting-r">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang='scss'>
#user-setting {
  color: #c7cce6;
  margin-top: 10px;
    min-height: 700px;
  > .setting-l {
    margin: 0 10px;
      padding: 0 30px;
      line-height: 40px;
      background: #181b2a;
    width: 23%;
    .router-link-active{
        color:#7a98f7;
    }
  }
  .setting-r {
     background: #181b2a;
    margin-right: 10px;
      padding: 30px;
    width: 77%;
  }
}
</style>
