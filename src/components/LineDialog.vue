<template>
  <el-dialog title="修改线路信息" :visible="visible" @close="handleClose">
    <!-- 表单内容 -->
    <el-form :model="formData" label-width="80px">
      <el-form-item label="线路编号">
        <el-input v-model="formData.lineNumber" />
      </el-form-item>
      <el-form-item label="发车间隔">
        <el-input v-model="formData.interval" />
      </el-form-item>
	  <el-form-item label="运行时间">
	    <el-input v-model="formData.duration" />
	  </el-form-item>
	  <el-form-item label="票价">
	    <el-input v-model="formData.price" />
	  </el-form-item>
	  <el-form-item label="首班时间">
	    <el-input v-model="formData.startTime" />
	  </el-form-item>
	  <el-form-item label="末班时间">
	    <el-input v-model="formData.endTime" />
	  </el-form-item>
      <!-- 其他表单项 -->
    </el-form>
    <!-- 确认和取消按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleUpdate">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    lineData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {} // 存放表单数据
    };
  },
  watch: {
    lineData: {
      handler(newVal) {
        // 每当 lineData 变化时更新表单数据
        this.formData = Object.assign({}, newVal);
      },
      immediate: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('close'); // 关闭浮动框
    },
    handleUpdate() {
      this.$emit('updateLine', this.formData); // 将修改后的数据传递给父组件
    }
  }
};
</script>