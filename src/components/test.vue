<template>
	<div style="text-align: center;">
		<h3 style="color:orange;">公交调度中心</h3>
	</div>
	<select v-model="selectedOption" style="padding: 10px; margin: auto;border-radius: 5px">
		<option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
	</select>
	<div
		style="display: flex;min-width: 1000px;width: 100%; text-align: center; background-image: url('/public/title.webp');background-repeat: no-repeat;background-size: 100% auto;">
		<div class="cheku">
			<span id="start"></span>
			<el-table :data="reststart" style="width: 100%;opacity: 0.8;background-color: white;" class="table">
				<el-table-column prop="id" label="id" width="50px" />
				<el-table-column prop="busNumber" label="busNumber" />
				<el-table-column prop="driverName" label="司机" />
				<el-table-column label="操作">
					<template v-slot="scope">
						<el-button size="mini" @click="showwork(scope.row,0)" type="primary">
							操作
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<svg :width="width" :height="height" style="margin: 0px;">
			<!-- 公交线路 -->
			<line :x1="margin" :y1="height / 2" :x2="width - margin" :y2="height / 2" stroke="black" stroke-width="2" />

			<!-- 站点圆圈和名称 -->
			<template v-for="(station, index) in stations" :key="index">
				<!-- 圆圈 -->
				<circle :cx="calculateXPosition2(index)" :cy="height / 2" r="10" stroke="black" stroke-width="2" />
				<!-- 站点名称 -->
				<text :x="calculateXPosition(index)" :y="heightchange(index)" text-anchor="middle" font-size="10">
					{{ station.label }}
				</text>
			</template>

			<!-- 公交车 -->
			<template v-for="(current, index) in currentStationsshang" :key="index">
				<image :x="getindex(current) - 10" :y="height / 2 - 75" :width="25" :height="25"
					xlink:href="/public/bus.webp" @mouseover="showDetail(current)" />
			</template>
			<template v-for="(current, index) in currentStationsxia" :key="index">
				<image :x="getindex(current) - 10" :y="height / 2 + 35" :width="25" :height="25"
					xlink:href="/public/bus2.jpg" @mouseover="showDetail(current)" />
			</template>
		</svg>
		<div class="cheku">
			<span id="end"></span>
			<el-table :data="restend" style="width: 100%;opacity: 0.8;background-color: white;" class="table">
				<el-table-column prop="id" label="id" width="50px" />
				<el-table-column prop="busNumber" label="busNumber" />
				<el-table-column prop="driverName" label="司机" />
				<el-table-column label="操作">
					<template v-slot="scope">
						<el-button size="mini" @click="showwork(scope.row)" type="primary">
							操作
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
	<div
		style="border: 1px solid orange; border-radius: 20px; padding: 40px;margin-right: 20px;margin-left: 20px;background-image: url('/public/human.gif');height: 200px;">
		<div
			style=" background-color: orange;width: 150px;position: absolute;transform: translateY(-40px) translateX(-40px);border-radius:20px 0px 20px 0px; padding: 5px;text-align: center;">
			<span style="color: white;font-family: '幼圆', 'YouYuan', Arial, sans-serif;">下班人员管理</span>
		</div>
		<el-table :data="offwork" class="table" style="opacity: 0.9;border-radius: 20px;" height="100%">
			<el-table-column prop="id" label="id" />
			<el-table-column prop="busNumber" label="busNumber" />
			<el-table-column prop="driverName" label="司机" />
			<el-table-column label="操作">
				<template v-slot="scope">
					<el-button size="mini" @click="showDialg(scope.row,1)" type="primary">
						出勤
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
	<hr style="height: 1px; background-color: orange;">
	<div>
		<el-dialog v-model="dialogVisible" title="选择线路和始发方向" style="padding: 10px;">
			<div>线路选择：
				<el-select v-model="selectedLine" placeholder="请选择线路编号">
					<el-option v-for="line in options" :key="line.value" :label="line.label" :value="line.value">
					</el-option>
				</el-select><br>
				方向选择：
				<el-select v-model="selectedStation" placeholder="请选择首班方向">
					<el-option label="正向" value="1"></el-option>
					<el-option label="反向" value="0"></el-option>
				</el-select>
			</div>
			<span slot="footer" class="dialog-footer" style="float: right;">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="attendance">确 定</el-button>
			</span>
		</el-dialog>
	</div>
	<div
		style="border: 1px solid orange; border-radius: 20px; padding: 40px;margin-right: 20px;margin-left: 20px;background-image: url('/public/busback.gif');height: 200px; text-align: center;">
		<div
			style=" background-color: orange;width: 150px;position: absolute;transform: translateY(-40px) translateX(-40px);border-radius:20px 0px 20px 0px; padding: 5px;text-align: center;">
			<span style="color: white;font-family: '幼圆', 'YouYuan', Arial, sans-serif;">线路调度管理</span>
		</div>

		<el-table :data="linemsg" class="table" height="100%" style="opacity: 0.9;border-radius: 20px;">
			<el-table-column prop="lineNumber" label="线路编号" />
			<el-table-column prop="interval" label="发车间隔" />
			<el-table-column prop="duration" label="运行时间" />
			<el-table-column prop="price" label="票价" />
			<el-table-column prop="startTime" label="首班车时间" />
			<el-table-column prop="endTime" label="末班车时间" />
			<el-table-column label="操作">
				<template v-slot="scope">
					<el-button size="mini" @click="showLineDialog(scope.row)" type="primary">
						修改
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
	<el-dialog title="修改线路信息" v-model="dialogVisible2" @close="handleClose">
	      <!-- 表单内容 -->
	      <el-form :model="formData" label-width="80px">
	        <el-form-item label="线路编号">
	          <el-input v-model="formData.lineNumber" disabled/>
	        </el-form-item>
	        <el-form-item label="发车间隔">
	          <el-input type="number" v-model="formData.interval" />
	        </el-form-item>
	        <el-form-item label="运行时间">
	          <el-input type="number" v-model="formData.duration" />
	        </el-form-item>
	        <el-form-item label="票价">
	          <el-input type="number" v-model="formData.price" />
	        </el-form-item>
	        <el-form-item label="首发时间">
				<el-time-picker
				      v-model="formData.time"
				      is-range
				      range-separator="To"
					  format="HH:mm"
				    />
	        </el-form-item>
	      </el-form>
	      <!-- 确认和取消按钮 -->
	      <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogVisible2=false">取消</el-button>
	        <el-button type="primary" @click="handleUpdate">确认</el-button>
	      </div>
	    </el-dialog>
</template>

<script>
	import { h, ref } from 'vue'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	export default {
		data() {
			return {
				dialogVisible: false,
				width: window.innerWidth / 2, // SVG宽度
				height: 200, // SVG高度
				margin: 20, // 边距
				stations: [], // 站点名称数组
				currentStationsshang: [], // 当前运行车辆的位置信息数组(正向)
				currentStationsxia: [],
				selectedOption: 1,
				line: 1,
				options: [],
				linebusdriver: [],
				stationnum: [], //站点顺序
				reststart: [],
				restend: [],
				offwork: [],
				selectedLine: 0,
				selectedStation: 0,
				attendancepeople: 0,
				timer: null,
				linemsg: [],
				selectedLine2: null,
				dialogVisible2: false,
				formData:""
			};
		},
		computed: {
			stationCount() {
				return this.stations.length;
			},
			spaceBetweenStations() {
				return (this.width - 2 * this.margin) / (this.stationCount - 1);
			}
		},
		mounted() {
			this.line=1;
			this.init();
			window.addEventListener('resize', this.updateScreenWidth);
			this.startTimer();
		},
		methods: {
			handleUpdate(){
				this.formData.startTime=`${this.formData.time[0].getHours()}:${this.formData.time[0].getMinutes() < 10 ? '0' : ''}${this.formData.time[0].getMinutes()}`;
				this.formData.endTime=`${this.formData.time[1].getHours()}:${this.formData.time[1].getMinutes() < 10 ? '0' : ''}${this.formData.time[1].getMinutes()}`;
				delete this.formData.time;
				this.$http.post("/linemsg/update",this.formData).then(res=>{
					if(res.data==true){
						ElMessageBox({
						    title: '提示',
						    message: h('p', null, [
						      h('span', null, '修改成功 ')
						    ]),
						  })
						console.log("success");
					}
				})
				console.log(this.formData);
				this.dialogVisible2 =false;
			},
			showLineDialog(row) {
				var time=[];
				this.selectedLine2 = Object.assign({}, row); // 复制当前行的数据到 selectedLine
				this.formData = Object.assign({}, row);
				const time1 = new Date();
				const timeParts = this.formData.startTime.split(":");
				time1.setHours(parseInt(timeParts[0], 10));
				time1.setMinutes(parseInt(timeParts[1], 10));
				const time2 = new Date();
				const timeParts2 = this.formData.endTime.split(":");
				time2.setHours(parseInt(timeParts2[0], 10));
				time2.setMinutes(parseInt(timeParts2[1], 10));
				time.push(time1);
				time.push(time2);
				this.formData.time=time;
				this.dialogVisible2 = true; // 打开浮动框
			},
			getLineMsg() {
				var param = {};
				this.$http.get("/linemsg/getLineMsg", {
					params: param
				}).then(res => {
					console.log(res);
					this.linemsg = res.data;
				})
			},
			startTimer() {
				// 设置定时器，每秒更新当前时间
				this.timer = setInterval(() => {
					this.init();
				}, 5000);
			},
			showwork(row, dir) {
				ElMessageBox.confirm(
						'请选择操作',
						'调度站管理', {
							confirmButtonText: '发车',
							cancelButtonText: '下班',
							type: 'info',
							center: true,
						}
					)
					.then(() => {
						if (dir == 0) {
							console.log("正方向发车。" + row.id);
							var param = {};
							param.direction = "0";
							param.id = row.id;
							var num = 0;
							if (this.stations != []) {
								num = 1;
							}
							param.localStation = num;
							this.$http.post("/linebusdriver/depart", param).then(res => {
								console.log("res");
							})
						} else {
							console.log("反方向发车。");
							var param = {};
							param.direction = "1";
							param.id = row.id;
							var num = 0;
							if (this.stations != []) {
								num = this.stations.length;
								s
							}
							param.localStation = num;
							this.$http.post("/linebusdriver/depart", param).then(res => {
								console.log("res");
							})
						}
					})
					.catch(() => {
						var param = {};
						param.id = row.id;
						this.$http.get("/linebusdriver/setWorkOff", {
							params: param
						}).then(res => {
							if (res.data == true) {
								alert("下班成功！");
								this.init();
							}
						})
					})
			},
			attendance() {
				var param = {};
				param.id = this.attendancepeople;
				param.lineNumber = this.selectedLine;
				param.direction = this.selectedStation;
				param.status = 1;
				this.$http.post("/linebusdriver/updateDirectionAndLineNumberById", param).then(res => {
					console.log(res);
					if (res.data == true) {
						alert("设置出勤成功");
						this.dialogVisible = false;
						this.init();
					}
				})
				console.log(param);
			},
			showDialg(row) {
				this.selectedLine = parseInt(row.lineNumber);
				this.selectedStation = row.direction;
				this.attendancepeople = row.id;
				this.dialogVisible = true;
			},
			getindex(current) {
				var data = this.linebusdriver;
				for (var i = 0; i < data.length; i++) {
					if (data[i].id == current.id) {
						return this.calculateXPosition(current.num - 1);

					}
				}
			},
			showDetail(current) {
				console.log(current);
				var data = this.linebusdriver;
				for (var a = 0; a < data.length; a++) {
					if (data[a].id == current.id) {
						var msgstate = ""
						if (data[a].standbystate = 1) {
							msgstate = "正常运行";
						} else {
							msgstate = "休息中";
						}
						alert("车牌号：" + data[a].busNumber + "\n司机：" + data[a].driverName + "\n状态：" + msgstate);
					}
				}
			},
			calculateXPosition(index) {
				if (index == 0) {
					return this.margin + index * this.spaceBetweenStations + 20;
				} else if (index == this.stations.length - 1) {
					return this.margin + index * this.spaceBetweenStations - 20;
				} else {
					return this.margin + index * this.spaceBetweenStations;
				}
			},
			calculateXPosition2(index) {
				return this.margin + index * this.spaceBetweenStations;
			},
			updateScreenWidth() {
				if (window.innerWidth >= 1000) {
					this.width = window.innerWidth / 2;
				}
			},
			heightchange(index) {
				if ((index + 1) % 2 == 1) {
					return this.height / 2 + 35;
				} else {
					return this.height / 2 - 35;
				}
			},
			getrest() {
				var param = {};
				this.$http.get('/linebusdriver/getRestAll', {
					params: param
				}).then(res => {
					var data = res.data;
					this.offwork = data;
				})
			},
			init() {
				var param = {};
				this.$http2.get('/line1/total', {
						params: param
					}).then(response => {
						var data = response.data;
						this.options = [];
						for (var num = 0; num < data.length; num++) {
							var a = {};
							a.value = data[num];
							a.label = "线路" + data[num];
							this.options.push(a);
						}
					})
					.catch(error => {
						console.log(error);
					});
				this.getdata(this.line);
				this.getlinebusdriverAll();
				this.getrest();
				this.getLineMsg();
			},
			getdata(number) {
				var param = {};
				param.number = number;
				this.$http2.get('/line1/getSationByNumber', {
						params: param
					}).then(response => {
						var data = response.data;
						this.stations = [];
						this.stationnum = [];
						for (var num = 0; num < data.length; num++) {
							var a = {};
							a.value = data[num].id;
							a.label = data[num].name;
							a.station = data[num].station;
							a.num = num;
							this.stations.push(a);
							document.getElementById("start").innerText = this.stations[0].label + "公交调度站";
							document.getElementById("end").innerText = this.stations[this.stations.length - 1].label +
								"公交调度站";
						}
						this.line = response.data[0].number;
					})
					.catch(error => {
						console.log(error);
					})
			},
			clean() {
				this.currentStations = [];
				this.reststart = [];
				this.restend = [];
				this.currentStationsshang = [];
				this.currentStationsxia = [];
			},
			getlinebusdriverAll() {
				var param = {};
				param.line = this.line;
				this.$http.get('/linebusdriver/getAllByLine', {
					params: param
				}).then(res => {
					var data = res.data;
					this.linebusdriver = [];
					this.linebusdriver = data;
					this.clean();
					console.log(data);
					for (var num = 0; num < data.length; num++) {
						if (data[num].status != 0) {
							if (data[num].standbystate != 0) {
								if (data[num].direction == 0) {
									var a = {};
									a.num = data[num].localStation;
									a.id = data[num].id;
									this.currentStationsshang.push(a);
								} else {
									var a = {};
									a.num = data[num].localStation;
									a.id = data[num].id;
									this.currentStationsxia.push(a);
								}
							} else {
								if (data[num].direction == 0) {
									this.restend.push(data[num]);

								} else {
									this.reststart.push(data[num]);
								}
							}
						}
					}
				})
			}
		},
		watch: {
			selectedOption(newValue, oldValue) {
				this.getdata(newValue);
				this.line = newValue;
				this.getlinebusdriverAll();
			}
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.updateScreenWidth);
		}
	};
</script>

<style scoped>
	.cheku {
		height: 100%;
		width: 25%;
	}

	.el-table-column {
		width: 50px;
	}
</style>
<style>
	.table .el-table__header th,
	.table .el-table__body-wrapper tbody td {
		text-align: center;
	}
</style>