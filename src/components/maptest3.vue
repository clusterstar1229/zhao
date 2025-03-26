<template>
	<div>
		<div id="map" style="width: 100%; height: 500px;"></div>
		<div>Total Distance: {{ totalDistance }} 米</div>
		<div>Total Duration: {{ convertedTime }} 分钟 {{ convertedSeconds }} 秒</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				map: null, // 地图实例
				points: [],
				totalDistance: 0, // 总路程
				totalDuration: 0, // 总时间
				convertedTime: 0,
				convertedSeconds: 0
			};
		},
		mounted() {
			var param = {};
			param.number = 2;
			this.$http.get('/line1/getSationByNumber', {
					params: param
				})
				.then(response => {
					let data = response.data
					this.points = data.map(item => {
					    let a = {}; // 初始化对象
					    a.name = item.name;
					    a.point = new BMap.Point(item.longitude, item.latitude);
					    return a;
					});
					this.initMap(); // 初始化地图
					this.searchRoute(); 
				})
				.catch(error => {
					console.log(error)
				})
		},
		methods: {
			initMap() {
				this.map = new BMap.Map("map"); // 创建地图实例
				this.map.centerAndZoom(new BMap.Point(103.948373, 30.808308), 15); // 设置地图的中心点和缩放级别
				const zoomControl = new BMap.NavigationControl();
				this.map.addControl(zoomControl);
				// 标记所有地点
				this.points.forEach(point => {
					const marker = new BMap.Marker(point.point); // 创建标记点
					this.map.addOverlay(marker); // 将标记点添加到地图上
					const label = new BMap.Label(point.name, {
						offset: new BMap.Size(20, -10)
					}); // 创建标记点的标签
					marker.setLabel(label); // 设置标记点的标签
				});
			},
			searchRoute() {
				const driving = new BMap.DrivingRoute(this.map, {
					onSearchComplete: this.onRouteSearchComplete
				}); // 创建驾车路线规划实例
				for (let i = 0; i < this.points.length - 1; i++) {
					
					driving.search(this.points[i].point, this.points[i + 1].point); // 调用驾车路线规划的search方法查询每段路线
				}
			},
			onRouteSearchComplete(result) {
				if (result.getNumPlans() > 0) { // 判断是否有规划方案
					const plan = result.getPlan(0); // 获取第一个规划方案
					const route = plan.getRoute(0); // 获取规划方案中的第一条路线
					const path = route.getPath(); // 获取路线的路径点数组
					const polyline = new BMap.Polyline(path, {
						strokeColor: "blue",
						strokeWeight: 6,
						strokeOpacity: 0.5
					}); // 创建折线，并设置样式
					this.map.addOverlay(polyline); // 将折线添加到地图上显示

					this.totalDistance += route.getDistance(false); // 获取路线的总路程，单位为米
					this.totalDuration += plan.getDuration(false);
				}
			}
		},
		computed: {
			convertedTime() {
				return Math.floor(this.totalDuration / 60); // 转换为分钟
			},
			convertedSeconds() {
				return this.totalDuration % 60; // 获取剩余的秒数
			}
		}
	};
</script>

<style>
	#map {
		height: 100%;
	}
</style>