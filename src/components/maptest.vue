<template>
	<div>
	    <div>
	      <label for="origin">起点：</label>
	      <input type="text" id="origin" v-model="originName" ref="originInput" />
	    </div>
	    <div>
	      <label for="destination">终点：</label>
	      <input type="text" id="destination" v-model="destinationName" ref="destinationInput" />
	    </div>
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
	      originName: "", // 起点名称
	      destinationName: "", // 终点名称
	      distance: "", // 路程
	      duration: "", // 所需时间
	      map: null, // 地图实例
	      driving: null, // 驾车路线实例
	      polyline: null // 折线实例
	    };
	  },
	  mounted() {
	    this.initMap(); // 初始化地图
	    this.initAutocomplete(); // 初始化自动完成
	  },
	  methods: {
	    initMap() {
	      this.map = new BMap.Map("mapContainer"); // 创建地图实例
	      this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 设置地图中心点和缩放级别
	      this.driving = new BMap.DrivingRoute(this.map, { // 创建驾车路线实例
	        onSearchComplete: result => { // 查询成功后的回调函数
	          if (this.driving.getStatus() === BMAP_STATUS_SUCCESS) { // 查询状态为成功时
	            const plan = result.getPlan(0); // 获取路线规划方案
	            this.distance = plan.getDistance(false); // 获取路程
	            this.duration = plan.getDuration(false); // 获取所需时间
	            const path = result.getPlan(0).getRoute(0).getPath(); // 获取路径点数组
	            if (this.polyline) { // 如果之前已经有了折线
	              this.map.removeOverlay(this.polyline); // 先将其从地图上移除
	            }
	            this.polyline = new BMap.Polyline(path, { // 根据路径点数组创建折线
	              strokeColor: "blue", // 折线颜色
	              strokeWeight: 5, // 折线宽度
	              strokeOpacity: 0.5 // 折线不透明度
	            });
	            this.map.addOverlay(this.polyline); // 将折线添加到地图上
	          }
	        }
	      });
		  const zoomControl = new BMap.NavigationControl();
		  this.map.addControl(zoomControl); // 添加缩放控件
	    },
	    initAutocomplete() {
	      const originAutocomplete = new BMap.Autocomplete({ // 创建自动完成实例
	        input: "origin", // 输入框id
	        location: this.map // 地图实例
	      });
	      const destinationAutocomplete = new BMap.Autocomplete({ // 创建自动完成实例
	        input: "destination", // 输入框id
	        location: this.map // 地图实例
	      });
	      originAutocomplete.addEventListener("onconfirm", event => { // 监听选中事件
	        const value = event.item.value; // 获取选中的值
	        const myValue = value.province + value.city + value.district + value.street + value.business;
	        this.originName = myValue; // 将输入框的值设置为选中的值
	      });
	      destinationAutocomplete.addEventListener("onconfirm", event => { // 监听选中事件
	        const value = event.item.value; // 获取选中的值
	        const myValue = value.province + value.city + value.district + value.street + value.business;
	        this.destinationName = myValue; // 将输入框的值设置为选中的值

	      });
	    },
	    searchRoute() {
	      if (!this.originName || !this.destinationName) {
	        alert("请输入起点和终点");
	        return;
	      }
	      const myGeo = new BMap.Geocoder(); // 创建地址解析器实例
	      myGeo.getPoint(
	        this.originName,
	        point => { // 解析起点地址
	          if (point) {
	            this.map.centerAndZoom(point, 12); // 将地图中心点设置为起点坐标
	            const origin = point;
	            myGeo.getPoint(
	              this.destinationName,
	              point => { // 解析终点地址
	                if (point) {
	                  const destination = point;
	                  this.driving.search(origin, destination); // 查询驾车路线
	                } else {
	                  alert("无法解析终点地址");
	                }
	              },
	              ""
	            );
	          } else {
	            alert("无法解析起点地址");
	          }
	        },
	        ""
	      );
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