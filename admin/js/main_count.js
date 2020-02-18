// <!-- 折线图 -->
// var json = '{"code":200,"msg":"获取成功","date":[{"date":"2019-04-20","count":23},{"date":"2019-04-21","count":19},{"date":"2019-04-22","count":29},{"date":"2019-04-23","count":24},{"date":"2019-04-24","count":28},{"date":"2019-04-25","count":28},{"date":"2019-04-26","count":19},{"date":"2019-04-27","count":25},{"date":"2019-04-28","count":25}]}';
// var obj = JSON.parse(json);
// loadEchars(obj);

function loadEchars(obj) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('curve_show'));

    var data = [];
    var date = [];
    for (var i = 0; i < obj.date.length; i++) {
        data.push(obj.date[i].count);
        date.push(obj.date[i].date);
    }

    option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: '月新增文章数',
        },

        xAxis: {
            name: '日',
            type: 'category',
            boundaryGap: false,
            data: date
        },
        legend: {
            data: ['新增文章'],
            top: '40'
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {
                    readOnly: false
                },
                magicType: {
                    type: ['line', 'bar']
                },
                restore: {},
                saveAsImage: {}
            },
            right: 50
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        series: [{
            name: '新增文章',
            type: 'line',
            smooth: true,
            // symbol: 'none',
            sampling: 'average',
            itemStyle: {
                color: '#f80'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(255,136,0,0.39)'
                    }, {
                        offset: .34,
                        color: 'rgba(255,180,0,0.25)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(255,222,0,0.00)'
                    }
                ])
            },
            data: data
        }],
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

// <!-- 环形图 -->
// 基于准备好的dom，初始化echarts实例
var myChart1 = echarts.init(document.getElementById('pie_show'));

option1 = {
    title: {
        left: 'center',
        text: '分类文章数量比',
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        x: 'center',
        data: ['爱生活', '趣美味', '爱旅行', '爱电影', '爱游泳'],
        top: 30
    },
    color: ['#5885e8', '#13cfd5', '#00ce68', '#ff9565', '#20ff19'],
    series: [{
        name: '分类名称',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            }
        },
        data: [{
                value: 335,
                name: '爱生活'
            },
            {
                value: 310,
                name: '趣美味'
            },
            {
                value: 234,
                name: '爱旅行'
            },
            {
                value: 135,
                name: '爱电影'
            },
            {
                value: 548,
                name: '爱游泳'
            }
        ]
    }]
};
// 使用刚指定的配置项和数据显示图表。
myChart1.setOption(option1);

// <!-- 柱状图 -->
// 基于准备好的dom，初始化echarts实例
var myChart2 = echarts.init(document.getElementById('column_show'));

option2 = {
    title: {
        left: 'center',
        text: '分类访问量',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },

    },
    legend: {
        data: ['爱生活', '趣美味', '爱旅行', '爱电影', '爱游泳'],
        top: 30
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        data: ['一月', '二月', '三月', '四月']
    }],
    yAxis: [{
        type: 'value'
    }],
    color: ['#5885e8', '#13cfd5', '#00ce68', '#ff9565', '#20ff19'],
    series: [{
            name: '爱生活',
            type: 'bar',
            data: [320, 332, 301, 334]
        },
        {
            name: '趣美味',
            type: 'bar',
            data: [220, 132, 101, 134]
        },
        {
            name: '爱旅行',
            type: 'bar',
            data: [220, 182, 191, 234]
        },
        {
            name: '爱电影',
            type: 'bar',
            data: [150, 232, 201, 154]
        },
        {
            name: '爱游泳',
            type: 'bar',
            data: [262, 118, 364, 426],
        },

    ]
};


// 使用刚指定的配置项和数据显示图表。
myChart2.setOption(option2);

// 入口函数;
$(function () {
    // 首页总文章数,日新增文章数,评论总数,日新增评论数;
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/admin/data/info',
        success: function (backData) {
            // console.log(backData);

            $('.spannel').children('em').eq(0).text(backData.totalComment);
            $('.spannel').children('em').eq(1).text(backData.dayArticle);
            $('.spannel').children('em').eq(2).text(backData.totalArticle);
            $('.spannel').children('em').eq(3).text(backData.dayComment);
        }
    });

    // 折线图;
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/admin/data/article',
        success: function (backData) {
            // console.log(backData);
            loadEchars(backData);
        }
    });
})