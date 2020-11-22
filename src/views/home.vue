<template>
  <div>
    <h1>首页</h1>
    <div id="con"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    let myChart = this.$eh.init(document.getElementById("con"));
    function genData(len, offset) {
      var lngRange = [-10.781327, 131.48];
      var latRange = [18.252847, 52.33];

      var arr = new Float32Array(len * 2);
      var off = 0;

      for (var i = 0; i < len; i++) {
        var x = +Math.random() * 10;
        var y =
          +Math.sin(x) -
          x * (len % 2 ? 0.1 : -0.1) * Math.random() +
          (offset || 0) / 10;
        arr[off++] = x;
        arr[off++] = y;
      }
      return arr;
    }

    let data1 = genData(5e5);
    let data2 = genData(5e5, 10);
    let option = {
      // title: {
      //   text: '本系统的周访问量',
      //   textStyle: {
      //     fontSize: 30,
      //     color: '#fac'
      //   },
      //   textAlign: 'auto',
      // },
      // xAxis: {
      //   type: "category",
      //   data: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      // },
      // yAxis: {
      //   type: "value",
      // },
      // series: [
      //   {
      //     data: [66, 500, 999, 1400, 800, 500, 1500],
      //     type: "line",
      //   },
      // ],

      //---------------------------------------
      title: {
        text:
          this.$eh.format.addCommas(data1.length / 2 + data2.length / 2) +
          " Points",

        // text: "本系统的周访问量",
        // textStyle: {
        //   fontSize: 30,
        //   color: "#fac",
        // },
        // textAlign: "auto",
      },
      tooltip: {},
      toolbox: {
        left: "center",
        feature: {
          dataZoom: {},
        },
      },
      legend: {
        orient: "vertical",
        right: 10,
      },
      xAxis: [{}],
      yAxis: [{}],
      dataZoom: [
        {
          type: "inside",
        },
        {
          type: "slider",
        },
      ],
      animation: false,
      series: [
        {
          name: "A",
          type: "scatter",
          data: data1,
          dimensions: ["x", "y"],
          symbolSize: 3,
          itemStyle: {
            opacity: 0.4,
          },
          large: true,
        },
        {
          name: "B",
          type: "scatter",
          data: data2,
          dimensions: ["x", "y"],
          symbolSize: 3,
          itemStyle: {
            opacity: 0.4,
          },
          large: true,
        },
      ],
    };
    myChart.setOption(option);
  },
};
</script>

<style scoped>
#con {
  width: 800px;
  height: 600px;
  margin: 20px auto;
}
</style>