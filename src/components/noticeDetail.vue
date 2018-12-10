<template>
    <div class="noticeDetail">
        <indexHeader></indexHeader>
        <div class="account-wrap">
            <div class="account">
                <div>
                    <div class="back-nav fColor1 ft20"> 网站公告
                        <span class="fr fColor2 curPer" @click="goBefore">&lt;&lt;返回</span>
                    </div>
                    <div class="nav-after"></div>
                </div>
                <div class="account-content">
                    <div class="detailBig">
                        <div class="mb30 clear">
                            <span class="fColor1 w90 fl tc">{{title}}</span>
                        </div>
                        <div class="detailContent fColor2">
                            <p v-html="content" ref="con"></p>
                        </div> 
                        <div class="fColor2 mt40">
                            <p class="tr">{{abstract}}</p>
                            <p class="tr mt5">{{update_time}}</p>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    </div>
</template>
<script>
import indexHeader from '@/view/indexHeader'
export default {
    name:'noticeDetail',
    components:{indexHeader},
    data (){
        return{
            title:'',
            content:'',
            abstract:'',
            update_time:''

        }
    },
    created(){
        this.address = localStorage.getItem('token') || '';
        this.id = this.$route.query.id;
        var id = this.id;
        this.$http({
            url: '/api/' + 'news/detail',
            method:'post',
            data:{id:id},
            headers: {'Authorization':  localStorage.getItem('token')},
        }).then(res=>{
            res = res.data;
            if(res.type  === 'ok'){
                this.title=res.message.title;
                this.content=res.message.content;
                this.abstract=res.message.abstract;
                this.update_time=res.message.update_time;
                this.setProperty();
            }else{
                // layer.msg(res.message);
            }
        }).catch(error=>{
            console.log(error)
        })

    },
    mounted(){
        // var tags=this.$refs.con.getElementsByTagName('p');
        // console.log(tags)
        // for(var i=0;i<tags.length;i++){
        //     console.log(tags)
        //     console.log(tags[i])
        //     tags[i].style.background='transparent'
        // }
    },
    methods:{
        goBefore(){
            this.$router.back(-1);
        },
       setProperty(){
            var tags=document.getElementsByTagName('p');
            HTMLCollection.prototype.forEach=function(callback){
                    [].slice.call(this).forEach(callback);
            };
            tags.forEach(function(e, i){
                    e.style.backgroundColor='#666 !important'
            });
            
            
       }
    }
}
</script>
<style lang="scss" scoped>
.noticeDetail{
    .account-wrap{
        background: url(../assets/images/account_center_bg.jpg) no-repeat;
        background-size: cover;
        .account {
            width: 1200px;
            margin: 0 auto;
            padding-top: 30px;
            overflow: hidden;
            min-height: 880px;
            .nav-after{
                display: block;
                height: 10px;
                background-color: #262a42;
            }
            .account-content {
                width: 100%;
                min-height: 750px;
                background-color: #181b2a;
                .detailBig{
                    padding: 48px 46px 20px;
                    .mb30{
                        margin-bottom: 30px;
                    }
                    .detailContent{
                        line-height: 26px;
                        p{
                          &>*{
                            background-color: #181b2a!important;
                           }  
                        }
                       
                    }
                    .mt5{
                        margin-top: 5px;
                    }
                }

            }

        }
    }
}
</style>



