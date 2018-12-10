<template>
<div class="login">
    <indexHeader></indexHeader>
    <div class="contentBK">
        <div class="content-wrap">
            <div class="account">
                <div class="main">
                    <p class="main_title">欢迎登录</p>
                    <div class="register-input">
                        <span class="register-item">账号</span>
                        <input type="text" class="input-main input-content" maxlength="20" v-model="account_number" id="account">
                    </div>
                     <div class="register-input">
                        <span class="register-item">密码</span>
                        <input type="password" class="input-main input-content" maxlength="16" v-model="password" id="pwd">
                    </div>
                    <div style="margin-top: 10px;">
                        <span class="register-item"></span>
                        <button class="register-button curPer" @click="login">登录</button>
                        <div class="have-account">
                            <router-link tag="span" class="baseColor" to="/forgetPwd" style="cursor:pointer">忘记密码</router-link>
                        </div>
                    </div>
                    <div class="right-tip ">
                        <p>还不是BitEX的用户？</p>
                        <p>立即注册，在全球领先的数字资产交易平台开始交易。</p>
                        <router-link :to="{ name: 'register'}">
                            <p class="baseColor mt20">免费注册</p>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <indexFooter></indexFooter>
</div>

</template>

<script>
import indexHeader from '@/view/indexHeader'
import indexFooter from '@/view/indexFooter'
    export default {
        name: "login",
        components:{indexHeader,indexFooter},
        data (){
            return{
                account_number:'',
                password:'',
            }
        },
		created (){
			this.account_number = this.$route.query.account_number || ''
		},
        methods:{
            userInfo(){
                this.$http({
                    url: '/api/'+'user/info',
                    method:'get',
                    data:{},  
                    headers: {'Authorization':  localStorage.getItem('token')},    
                }).then(res=>{
                    // console.log(res);
                    if(res.data.type == 'ok'){
                    console.log(res)
                    localStorage.setItem('user_id',res.data.message.id);
                    // localStorage.setItem('email',res.data.message.email);
                    localStorage.setItem('extension_code',res.data.message.extension_code);
                    }
                }).catch(error=>{
                    
                })
                            
            },
            login(){
                let account_number = this.$utils.trim(this.account_number);
                let password = this.$utils.trim(this.password);
                if(this.account_number.length == ''){
                    layer.tips('请输入账号!', '#account');
                    return;
                }
                if(this.password.length<6){
                    layer.tips('密码不能小于六位!', '#pwd');
                    return;
                }
                var i = layer.load();
                this.$http({
					url: '/api/' + 'user/login',
					method:'post',
					data:{
						user_string: account_number,
                        password : password,
                        type:1
					}
				}).then(res=>{
                    layer.close(i);
                    // console.log(res);
                    
					res = res.data;
					if(res.type  === 'ok'){
						localStorage.setItem('token',res.message);
                        localStorage.setItem('accountNum',account_number);
                        this.$store.commit('setAccountNum');
                        this.userInfo();
                        this.$router.push('/');
					}else{
						layer.msg(res.message);
					}
				}).catch(error=>{
					console.log(error)
				})
            }
        },
        beforeRouteEnter(to,from,next){
            if(from.name == 'dealCenter'){
                window.location.reload()
            }
            next()
        }

    }
</script>

<style scoped>
	.content-wrap{background: url(../../static/imgs/bg_login.png) center bottom 316px repeat-x,-webkit-linear-gradient(top,#21263f,#262a42);}
	.account{width: 1200px;margin: 0 auto;padding-top: 93px;overflow: hidden;min-height: 880px;}
	.main{position: relative;padding: 0 0 60px 30px;}
	.main_title{font-size: 36px;color: #c7cce6;}
    .register-item{display: block;height:22px;color: #61688a;font-size: 12px}
	.register-input{position: relative;margin-top: 20px}
	.input-box{position: relative;margin-top: 40px;}
	.input-main{width: 520px;min-height: 46px;border: 1px solid #4e5b85;padding: 0 20px;color: #c7cce6;font-size: 14px;border-radius: 3px;background-color: #1e2235; }
	.icon{width: 48px;height: 48px;line-height: 48px;border-right: 1px solid #52688c;position: absolute;top: 0;}
	.login-btn{width: 420px;margin-top: 40px;background: #5697f4;font-size: 16px;border-radius: 4px;color: #fff;line-height: 48px;cursor: pointer;}
	.noaccount{color: #fff;}
    .register-button{width:200px;display: inline-block;line-height: 46px;background-color: #7a98f7;border-radius: 4px;color: #fff;border: none}
    .have-account{font-size: 14px;display:inline-block;margin-left: 30px}
    .right-tip{position: absolute;left: 620px;top: 70px;line-height: 24px;padding-right: 50px;margin-top: 10px;font-size: 14px;color: #61688a;}
</style>
