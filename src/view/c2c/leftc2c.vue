<template>
	<div class="leftNav ft14">
		<ul class="fColor1">
			<li v-for="(item,index) in array" :class="index == curActive ? 'active' :''" @click="goto(index,item.page)">
				<span>{{item.text}}</span>   
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		name: "leftc2c",
		data() {
			return {
				curActive:0,
				array:[
					{
						text: 'C2C',
						page:'c2cOrder',
						children:['c2cOrder']
					},

					{
						text: '我发布的C2C',
						page:'c2cRelease',
						children:['c2cRelease']
					},
					{
						text: '我交易的C2C',
						page:'c2cTrade',
						children:['c2cTrade']
					}
					
				],
			}
		},
		created(){
			let name = this.$route.name;
			this.curActive = this.array.findIndex( val => val.page === name || (val.children && val.children.includes(name)));
			console.log(name);
			if(name == 'c2cDetail'){
         this.curActive = 1;
			}

		},
		mounted(){
			this.bus.$on("nav_name", name =>{
				this.curActive = this.array.findIndex( val => val.page === name || (val.children && val.children.includes(name))) ;
			})
		},
		methods: {
			goto(index,name) {
				this.curActive=index;
				this.$router.push({name: name, params: {lang: this.lang}})
			},

		}
	};
</script>
<style lang="scss" scoped>
	.leftNav{
		
		ul{
			height:820px;
			li{
				height:54px;
				line-height:54px;
				padding-left:38px;
				margin-bottom:4px;
				cursor:pointer;
				img{
					margin-right:12px;
					margin-top:-4px;
					width:20px;
					vertical-align: middle;
				}
			}
			.active{
				color:rgb(86, 151, 244);
				background-color: rgb(39, 49, 66);
				border-bottom: none;
				display: block;
			}
		}
	}
</style>


