<script>
	import {
		RouterLink,
		RouterView
	} from 'vue-router'
	import maptest from './components/maptest.vue'
	import maptest2 from './components/maptest2.vue'
	import maptest3 from './components/maptest3.vue'
	import test from './components/test.vue'


	export default {
		data() {
			return {
			}
		},
		methods: {
			handleChange(newArray) {
			},
			confirmSort() {
			},
		},
		mounted() {
		},
		components: {
			//maptest,
			//maptest2
			//maptest3
			test
			//draggable
		}
	}
</script>

<template>
	<RouterView />
	<div>
		<test></test>
	</div>
</template>

<style>
	li {
		list-style: none;
	}

	.selul {
		display: flex;
		width: 80%;
		padding: 20px;
		margin: auto;
	}

	.li2 {
		width: 20%;
		height: 100px;
		background-color: aliceblue;
		text-align: center;
		border: 1px solid;
		border-radius: 10px;
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.4);
		padding: 20px;
		transition: background-color 0.8s ease;
		margin-left: 20px;
		margin-right: 20px;
	}

	.li2:hover {
		background-color: orange;
		color: white;
	}

	.gradient-container {
	  width: 100%;
	  height: 100vh;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
</style>