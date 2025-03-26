<template>
	<div>
	    <button @click="searchRoute">查询路线</button>
	    <div id="mapContainer"></div>
	    <div>路程：{{ distance }} 米</div>
	    <div>所需时间：{{ duration }} 秒</div>
	  </div>
</template>

<script>
	export default {
	  data() {
	    return {
	      distance: "", // 路程
	      duration: "", // 所需时间
	      map: null, // 地图实例
	      polyline: null, // 折线实例
	      points: [ // 存储所有地点信息，包括起点和终点
	        { name: "地点1", point: new BMap.Point(103.963852,30.788844) },
	        { name: "地点2", point: new BMap.Point(103.960538,30.786595) },
	        { name: "地点3", point: new BMap.Point(103.962218,30.780917) },
	        { name: "地点4", point: new BMap.Point(103.955786,30.778606) },
	        { name: "地点5", point: new BMap.Point(103.978742,30.763638) }
	      ]
	    };
	  },
	  mounted() {
	    this.initMap(); // 初始化地图
	  },
	  methods: {
	    initMap() {
	      this.map = new BMap.Map("mapContainer"); // 创建地图实例
	      this.map.centerAndZoom(new BMap.Point(104.06, 30.67), 16); // 设置地图中心点和缩放级别
		  const zoomControl = new BMap.NavigationControl();
		  this.map.addControl(zoomControl); 
	    },
	    searchRoute() {
	      const paths = [];
	      const points = this.points.slice(0, -1); // 去除终点，因为最后一个点没有下一个点与之连接
	      let index = 0;
	
	      // 定义回调函数
	      const searchCallback = (result) => {
	        if (result && result.getNumPlans() > 0) {
	          const plan = result.getPlan(0); // 获取路线规划方案
			  this.mathdistance(plan.getDistance(false),plan.getDuration(false));
	          const path = plan.getRoute(0).getPath(); // 获取路径点数组
	          paths.push(...path); // 将路径点数组添加到总路径点数组中
	        }
	
	        index++;
	        if (index < points.length - 1) {
	          const current = points[index];
	          const next = points[index + 1];
	          if (current && current.point && next && next.point) { // 判断当前点和下一个点是否存在
	            // 继续查询下一个点与之连接的驾车路线
	            const driving = new BMap.DrivingRoute(this.map, { onSearchComplete: searchCallback });
	            driving.search(current.point, next.point);
	          } else {
	            // 跳过本次循环，直接进入回调函数
	            searchCallback(result);
	          }
	        } 
			else if (index === points.length - 1) {
			    const current = points[index];
			    const next = this.points[this.points.length - 1];
			    if (current && current.point && next && next.point) {
			        // 查询最后一个点到终点的驾车路线
			        const driving = new BMap.DrivingRoute(this.map, { onSearchComplete: searchCallback });
			        driving.search(current.point, next.point);
			    } else {
			        // 跳过本次循环，直接进入回调函数
			        searchCallback(result);
			    }
			}
			else {
	          // 所有驾车路线查询完成后，创建折线并添加到地图上
	          this.createPolyline(paths);
	        }
	      };
	
	      // 第一个点与第二个点进行驾车路线查询
	      const driving = new BMap.DrivingRoute(this.map, { onSearchComplete: searchCallback });
	      driving.search(points[0].point, points[1].point);
	    },
		mathdistance(dis){
			this.distance=this.distance+dis;
			console.log(this.distance);
		},
	    createPolyline(paths) {
	      if (this.polyline) {
	        this.map.removeOverlay(this.polyline);
	      }
	      this.polyline = new BMap.Polyline(paths, {
	        strokeColor: "blue",
	        strokeWeight: 5,
	        strokeOpacity: 0.5
	      });
	      this.map.addOverlay(this.polyline);
	    }
	  }
	};
</script>

<style scoped>
	#app {
	  text-align: center;
	}
	#mapContainer {
	  width: 100%;
	  height: 300px;
	  margin: 20px auto;
	}
	.input-container {
	  margin: 10px 0;
	}
	.input-container label {
	  display: inline-block;
	  width: 60px;
	}
	.input-container input {
	  width: 200px;
	  padding: 5px;
	  border: 1px solid #ccc;
	}
</style>