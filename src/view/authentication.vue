<template>
  <div class="account-main wrap fColor1">
    <div class="title">身份认证</div>
    <div class="main-content mt20">
      <div v-show="review_status==0">
        <div class="main-input">
          <div class="flex alcenter center">
            <span>姓名：</span>
            <input type="text" placeholder="请输入真实姓名" id="name" v-model="name">
          </div>
          <div class="flex alcenter center mt20">
            <span>身份证：</span>
            <input type="text" placeholder="请输入身份证号" id="card" v-model="card_id">
          </div>
        </div>
        <div class="mt40 fColor1 ft14 tc">请上传身份证正反面和手持身份证，第一张为正面，第二张为反面,第三张为手持身份证。</div>
        <div class="idimg flex center mt40">
          <div>
            <img :src="src1" alt>
            <input type="file" id="file" accept="image/*" name="file" @change="file1">
          </div>
          <div>
            <img :src="src2" alt>
            <input type="file" id="file" accept="image/*" name="file" @change="file2">
          </div>
          <div>
            <img :src="src3" alt>
            <input type="file" id="file" accept="image/*" name="file" @change="file3">
          </div>
        </div>
        <div class="updata tc">
          <input type="button" value="提交" @click="updata">
        </div>
      </div>
      <div v-show="review_status==1">
        <div class="tc ft30 au-statue">审核中...</div>
      </div>
      <div v-show="review_status==2">
        <div class="tc ft30 au-statue">已认证!</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "authentication",
  data() {
    return {
      name: "",
      card_id: "",
      src1: "../../static/imgs/addimg.png",
      src2: "../../static/imgs/addimg.png",
      src3: "../../static/imgs/addimg.png",
      review_status: ""
    };
  },
  created() {
    this.token = localStorage.getItem("token");
  },
  methods: {
    file1() {
      var that = this;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function(e) {
        that.src1 = e.target.result;
      };
      var formData = new FormData();
      formData.append("file", event.target.files[0]);
      $.ajax({
        url: "/api/" + "upload",
        type: "post",
        data: formData,
        processData: false,
        contentType: false,
        success: function(msg) {
          that.src1 = msg.message;
        }
      });
    },
    file2() {
      var that = this;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function(e) {
        that.src2 = e.target.result;
      };
      var formData = new FormData();
      formData.append("file", event.target.files[0]);
      $.ajax({
        url: "/api/" + "upload",
        type: "post",
        data: formData,
        processData: false,
        contentType: false,
        success: function(msg) {
          that.src2 = msg.message;
        }
      });
    },
    file3() {
      var that = this;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function(e) {
        that.src3 = e.target.result;
      };
      var formData = new FormData();
      formData.append("file", event.target.files[0]);
      $.ajax({
        url: "/api/" + "upload",
        type: "post",
        data: formData,
        processData: false,
        contentType: false,
        success: function(msg) {
          that.src3 = msg.message;
        }
      });
    },
    updata() {
      var that = this;
      let name = this.$utils.trim(that.name);
      let card_id = this.$utils.trim(that.card_id);
      if (this.name.length == "") {
        layer.tips("请输入姓名!", "#name");
        return;
      }
      if (this.card_id.length == "") {
        layer.tips("请输入身份证号!", "#card");
        return;
      }
      
      if (that.src1 == "" || that.src2 == '' || that.src3 == '') {
        layer.tips("请上传证件图片!","#name");
        return;
      }
      this.$http({
        url: "/api/" + "user/real_name",
        method: "post",
        data: {
          name: name,
          card_id: card_id,
          front_pic: that.src1,
          reverse_pic: that.src2,
          hand_pic: that.src3
        },
        headers: { Authorization: that.token }
      })
        .then(res => {
          layer.msg(res.data.message);
          setTimeout(function(){
            that.$router.push("/");
          },500);
        })
        .catch(error => {});
    },
    Info() {
      var that = this;
      this.$http({
        url: "/api/" + "user/center",
        method: "get",
        data: {},
        headers: { Authorization: that.token }
      })
        .then(res => {
          that.review_status = res.data.message.review_status;
        })
        .catch(error => {});
    }
  },
  mounted() {
    this.Info();
  }
};
</script>
<style scoped lang="scss">
.account-main {
  background: #273041;
  .title {
    width: 100%;
    line-height: 60px;
    background: #181b2a;
    border-radius: 4px;
    padding-left: 20px;
  }
  .main-content {
    background: #181b2a;
    min-height: 700px;
    border-radius: 2px;
    .main-input {
      margin: 0 auto;
      text-align: center;
      padding-top: 100px;
      span {
        width: 100px;
      }
      input {
        width: 320px;
        min-height: 46px;
        border: 1px solid #4e5b85;
        padding: 0 20px;
        color: #c7cce6;
        font-size: 14px;
        border-radius: 3px;
        background-color: #1e2235;
      }
    }
    .idimg {
      div {
        width: 160px;
        height: 160px;
        overflow: hidden;
        position: relative;
        background-size: 100% 100%;
        border: 1px solid #e2e2e2;
        margin-left: 50px;
        input {
          position: absolute;
          z-index: 11110;
          opacity: 0;
          width: 100%;
          height: 160px;
          top: 0;
          cursor: pointer;
        }
        img{
            width: 100%;
        }
      }
    }
    .updata {
      input {
        width: 300px;
        height: 45px;
        border-radius: 4px;
        color: #c7cce6;
        font-size: 14px;
        margin: 0 auto;
        margin-left: 100px;
        margin-top: 60px;
        background: #5697f4;
      }
    }
    .au-statue {
      padding-top: 100px;
      font-size: 30px;
    }
  }
}
</style>
