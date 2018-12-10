<template>
    <div class="notice">
        <div class="notice_container ft14">
            <img class="inblock fl mt10 mr20" src="@/assets/images/notice.png" alt="">
            <span class="inblock fl curPer" @click="detail()">{{title}}</span>
            <span class="inblock fr baseColor curPer" @click="go">查看更多></span>
        </div>
	</div>
</template>

<script>
    export default {
        name: "notice",
        data (){
            return{
                title:'',
                id:''
            }
        },
        created(){
            this.$http({
                url: '/api/' + 'news/list',
                method:'get',
                data:{}
            }).then(res=>{
                res = res.data;
                if(res.type  === 'ok'){
                    this.title = res.message.list[0].title;
                    this.id = res.message.list[0].id
                }else{
                    // layer.msg(res.message);
                }
            }).catch(error=>{
                console.log(error)
            })
        },
        methods:{
            go(){
                this.$router.push({name:'noticeList'})
            },
            detail(){
                var id = this.id;
                this.$router.push({
                    name: 'noticeDetail',
                    query:{id:id}
                });
            }
        }

    }
</script>

<style scoped>
.notice_container{width:100%;height :40px;padding: 0 30px; background-color: #181b2a;line-height: 40px;color: #637085}

</style>
