<template>
    <div class="chart">
        <div class="line_title fColor1">
            <span v-for="(item,index) in lineList" :class="{'active' :index==current}" @click="changeCyle(index)">{{item}}</span>     
        </div>
        <div id="container" style="min-width:400px;height:510px">暂无数据..</div>
        <!-- <div>
		<iframe src="../../static/k_line/kline.html" frameborder="0" width="100%" height="540" allowfullscreen scrolling="no" allowtransparency="true"></iframe>
	</div> -->
    </div>
</template>

<script>
    export default {
        name: "chart",
        data (){
            return{
                lineList:["日","周","月"],
                current:0,
                address:'',
                kData:''
            }
        },
        created(){
            this.address = localStorage.getItem('address') || '';
        },
        methods: {
            changeCyle(index){
              var index=index;
              this.current=index;
        //       this.getData();
            },
            // Chart(){
            
            // this.$http({
            //         url:'/api/'+'',
            //         method:'post',
            //         data:{
                       
            //         }
            // }).then(res=>{
            //     if(res.data.type=='ok'){
            //         console.log(data)
            //     }else{
            //         layer.msg(res.data.message)
            //     }
            // })
            getData(){
                // this.$http({
                //         url:'https://data.jianshukeji.com/stock/history/000001',
                //         method:'get',
                // }).then(res=>{

                // console.log(res.data.data)
                // // this.kData.push(res.data.data)
                // // this.kData=this.kData
                // // console.log(res.data.data[0])
                // // console.log(this.kData[0][0])
                // // this.chartLine(this.kData)

                // })
                    this.$http({
                        url: 'http://www.2kex.com/api/deal/info',
                        method:'post',
                        data:{
                           legal_id:3,
                           currency_id :2,
                           type:1
                        }
                    }).then(res=>{
                        if(res.data.type=='ok'){
                            console.log(res.data.message)
                            var day=res.data.message.day;
                            var week=res.data.message.week;
                            var month=res.data.message.month;
                        //     console.log(month)
                            var dline=[];
                            var wline=[];
                            var mline=[];
                        // 天
                            for(let i=0;i<day.length;i++){
                                var dayData=[];
                                dayData.push((day[i].data.timestamp*1000),Number(day[i].data.open),Number(day[i].data.hight),Number(day[i].data.low),Number(day[i].data.close),Number(day[i].data.volume))
                                dline.push(dayData)
                            }
                        //     console.log(dline)
                        // 周
                            for(let i=0;i<week.length;i++){
                                var weekData=[];
                                weekData.push((week[i].data.timestamp*1000),Number(week[i].data.open),Number(week[i].data.hight),Number(week[i].data.low),Number(week[i].data.close),Number(week[i].data.volume))
                                wline.push(weekData)
                            }
                        //     console.log(wline) 
                        //  月
                             for(let i=0;i<month.length;i++){
                                var monthData=[];
                                monthData.push((month[i].data.timestamp*1000),Number(month[i].data.open),Number(month[i].data.hight),Number(month[i].data.low),Number(month[i].data.close),Number(month[i].data.volume))
                                mline.push(monthData)
                            }
                        //     console.log(mline)
                        if(this.current==0){
                           this.kData=dline;   
                        console.log('day')  
                        }else if(this.current==1){
                           this.kData=wline;   
                        console.log('week')
                        }else{
                           this.kData=mline; 
                        console.log('month')    
                        }
                            
                            this.chartLine(this.kData)
                        }else{
                            // layer.msg(res.data.message)
                        }
                    })
           
            },
            chartLine(data){
                Highcharts.setOptions({
                lang: {
                        rangeSelectorZoom: ''
                }
                });
                data = data;
                // console.log(data)
                var ohlc = [],
                volume = [],
                dataLength = data.length,
                // set the allowed units for data grouping
                groupingUnits = [[
                        'week',                         // unit name
                        [1]                             // allowed multiples
                ], [
                        'month',
                        [1, 2, 3, 4, 6]
                ]],
                i = 0;
                for (i; i < dataLength; i += 1) {
                        ohlc.push([
                                data[i][0], // the date
                                data[i][1], // open
                                data[i][2], // high
                                data[i][3], // low
                                data[i][4] // close
                        ]);
                        volume.push([
                                data[i][0], // the date
                                data[i][5] // the volume
                        ]);
                }
                // create the chart
                var chart = Highcharts.stockChart('container', {
                        rangeSelector: {
                                selected: 1,
                                inputDateFormat: '%Y-%m-%d'
                        },
                        title: {
                                text: '行情趋势图'
                        },
                        xAxis: {
                                dateTimeLabelFormats: {
                                        millisecond: '%H:%M:%S.%L',
                                        second: '%H:%M:%S',
                                        minute: '%H:%M',
                                        hour: '%H:%M',
                                        day: '%m-%d',
                                        week: '%m-%d',
                                        month: '%y-%m',
                                        year: '%Y'
                                }
                        },
                        tooltip: {
                                split: false,
                                shared: true,
                        },
                        yAxis: [{
                                labels: {
                                        align: 'right',
                                        x: -3
                                },
                                title: {
                                        text: '股价'
                                },
                                height: '65%',
                                resize: {
                                        enabled: true
                                },
                                lineWidth: 2
                        }, {
                                labels: {
                                        align: 'right',
                                        x: -3
                                },
                                title: {
                                        text: '成交量'
                                },
                                top: '65%',
                                height: '35%',
                                offset: 0,
                                lineWidth: 2
                        }],
                        series: [{
                                type: 'candlestick',
                                name: 'JNB',
                                color: 'green',
                                lineColor: 'green',
                                upColor: 'red',
                                upLineColor: 'red',
                                tooltip: {
                                },
                                navigatorOptions: {
                                        color: Highcharts.getOptions().colors[0]
                                },
                                data: ohlc,
                                dataGrouping: {
                                        units: groupingUnits
                                },
                                id: 'sz'
                        },{
                                type: 'column',
                                data: volume,
                                yAxis: 1,
                                dataGrouping: {
                                        units: groupingUnits
                                }
                        }]
                });
            }
        },
        mounted(){
        //     this.getData();
        }
}
</script>

<style lang="scss" scoped>
.chart{
    width: 100%;
    .line_title{
        width: 100%;
        line-height: 30px;
        background: #181b2a;
        // padding-left: 30px;
        span{
            display: inline-block;
            width: 30px;
            text-align: center;
            margin-left: 20px;
            cursor: pointer;
        }
    }
    .highcharts-axis-resizer {
		        stroke: #eee;
    }
    .highcharts-axis-resizer:hover {
        stroke: #ccc;
    }
}
</style>


