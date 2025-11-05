<template>
  <div class="dashboard">
    <div class="page-title">
      <h1>系统概览</h1>
    </div>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">待处理申请</div>
              <div class="stat-value">28</div>
              <div class="stat-trend">较上周增长 12%</div>
            </div>
            <el-icon class="stat-icon" :size="48" color="#4a7bb8"><Document /></el-icon>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">待施工任务</div>
              <div class="stat-value">15</div>
              <div class="stat-trend">较上周减少 5%</div>
            </div>
            <el-icon class="stat-icon" :size="48" color="#4a7bb8"><DataAnalysis /></el-icon>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">待安装任务</div>
              <div class="stat-value">22</div>
              <div class="stat-trend">较上周增长 8%</div>
            </div>
            <el-icon class="stat-icon" :size="48" color="#4a7bb8"><DocumentCopy /></el-icon>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">本月完成</div>
              <div class="stat-value">45</div>
              <div class="stat-trend">较上月增长 15%</div>
            </div>
            <el-icon class="stat-icon" :size="48" color="#4a7bb8"><CircleCheck /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>申请趋势</span>
            </div>
          </template>
          <div class="chart-container" ref="trendChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>任务完成率</span>
            </div>
          </template>
          <div class="chart-container" ref="pieChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近申请列表 -->
    <el-row class="table-row">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近申请</span>
            </div>
          </template>
          <el-table :data="recentApplications" style="width: 100%">
            <el-table-column prop="id" label="申请编号" width="150" />
            <el-table-column prop="applicantName" label="申请人" width="120" />
            <el-table-column prop="phone" label="联系电话" width="140" />
            <el-table-column prop="address" label="安装地址" min-width="200" />
            <el-table-column prop="createDate" label="申请日期" width="120" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)" size="small">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="primary" text size="small" @click="viewDetail(scope.row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Document, DataAnalysis, DocumentCopy, CircleCheck } from '@element-plus/icons-vue'
import { useApplicationStore } from '../stores/application'
import * as echarts from 'echarts'

const router = useRouter()
const applicationStore = useApplicationStore()

const trendChart = ref(null)
const pieChart = ref(null)
let trendChartInstance = null
let pieChartInstance = null

// 窗口大小调整处理函数
const handleResize = () => {
  trendChartInstance?.resize()
  pieChartInstance?.resize()
}

const recentApplications = computed(() => {
  return [
    {
      id: 'BZ20230701001',
      applicantName: '张三',
      phone: '13800138001',
      address: '北京市海淀区中关村大街35号',
      createDate: '2023-07-01',
      status: '申请中'
    },
    {
      id: 'BZ20230630002',
      applicantName: '李四',
      phone: '13900138002',
      address: '北京市朝阳区建国路88号',
      createDate: '2023-06-30',
      status: '已通过'
    },
    {
      id: 'BZ20230629003',
      applicantName: '王五',
      phone: '13700137003',
      address: '北京市西城区西长安街1号',
      createDate: '2023-06-29',
      status: '已驳回'
    },
    {
      id: 'BZ20230628004',
      applicantName: '赵六',
      phone: '13600136004',
      address: '北京市丰台区丰台南路20号',
      createDate: '2023-06-28',
      status: '施工中'
    }
  ]
})

const getStatusType = (status) => {
  const typeMap = {
    '申请中': 'primary',
    '已通过': 'success',
    '已驳回': 'danger',
    '施工中': 'warning'
  }
  return typeMap[status] || 'info'
}

const viewDetail = (row) => {
  router.push(`/applications/${row.id}`)
}

const initCharts = () => {
  // 申请趋势图
  if (trendChart.value) {
    // 销毁已存在的实例
    if (trendChartInstance) {
      trendChartInstance.dispose()
    }
    
    trendChartInstance = echarts.init(trendChart.value)
    trendChartInstance.setOption({
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        axisLine: {
          lineStyle: {
            color: '#e0e0e0'
          }
        },
        axisLabel: {
          color: '#666'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        }
      },
      series: [{
        name: '申请数量',
        type: 'line',
        smooth: true,
        data: [18, 25, 15, 38, 45, 30, 52],
        itemStyle: {
          color: '#4a7bb8'
        },
        lineStyle: {
          width: 3,
          color: '#4a7bb8'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(74, 123, 184, 0.3)' },
              { offset: 1, color: 'rgba(74, 123, 184, 0.05)' }
            ]
          }
        }
      }]
    })
  }
  
  // 任务完成率环形图
  if (pieChart.value) {
    // 销毁已存在的实例
    if (pieChartInstance) {
      pieChartInstance.dispose()
    }
    
    pieChartInstance = echarts.init(pieChart.value)
    pieChartInstance.setOption({
      title: {
        text: '75%',
        subtext: '任务完成率',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#4a7bb8'
        },
        subtextStyle: {
          fontSize: 14,
          color: '#999'
        }
      },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 75, name: '已完成', itemStyle: { color: '#4a7bb8' } },
          { value: 25, name: '未完成', itemStyle: { color: '#e8f4ff' } }
        ]
      }],
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        data: ['已完成', '未完成'],
        textStyle: {
          color: '#666'
        }
      }
    })
  }
}

onMounted(() => {
  nextTick(() => {
    // 使用 setTimeout 确保 DOM 完全渲染
    setTimeout(() => {
      initCharts()
    }, 100)
  })
  
  // 监听窗口大小变化，重绘图表
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例
  if (trendChartInstance) {
    trendChartInstance.dispose()
    trendChartInstance = null
  }
  if (pieChartInstance) {
    pieChartInstance.dispose()
    pieChartInstance = null
  }
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.page-title {
  margin-bottom: 24px;
}

.page-title h1 {
  font-size: 22px;
  color: #262626;
  font-weight: 600;
  margin: 0;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8f4ff;
  background: #fff;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(74, 123, 184, 0.15);
  border-color: #4a7bb8;
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #4a7bb8;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 12px;
  color: #999;
}

.stat-icon {
  opacity: 0.3;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card :deep(.el-card__header) {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
}

.chart-card :deep(.el-card__body) {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #262626;
}

.chart-container {
  width: 100%;
}

.table-row :deep(.el-card__header) {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
}

.table-row :deep(.el-table) {
  font-size: 14px;
}

.table-row :deep(.el-table th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
}

.table-row :deep(.el-table td) {
  padding: 12px 0;
}

.table-row :deep(.el-tag) {
  border-radius: 4px;
  padding: 4px 12px;
  border: none;
  font-weight: 500;
}
</style>
