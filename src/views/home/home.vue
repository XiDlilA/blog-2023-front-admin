<template>
  <div>
    <!-- 统计数据 -->
    <el-row :gutter="30">
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont el-icon-myfangwenliang" style="color: #40c9c6" />
          </div>
          <div class="card-desc">
            <div class="card-title">访问量</div>
            <div class="card-count">{{ pageInfo.viewsCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont el-icon-myuser" style="color: #34bfa3" />
          </div>
          <div class="card-desc">
            <div class="card-title">用户量</div>
            <div class="card-count">{{ pageInfo.userCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i
              class="iconfont el-icon-mywenzhang-copy"
              style="color: #f4516c"
            />
          </div>
          <div class="card-desc">
            <div class="card-title">文章量</div>
            <div class="card-count">{{ pageInfo.articleCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <el-icon color="#36a3f7" class="no-inherit">
              <MessageBox />
            </el-icon>
          </div>
          <div class="card-desc">
            <div class="card-title">留言量</div>
            <div class="card-count">{{ pageInfo.messageCount }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 一周访问量展示 -->
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">一周访问量</div>
      <ViewCount :xdata="ViewCountData.x" :ydata="ViewCountData.y" />
    </el-card>
    <!-- 文章贡献统计 -->
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">文章贡献统计</div>
    </el-card>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <!-- 文章浏览量排行 -->
      <el-col :span="16">
        <el-card>
          <div class="e-title">文章浏览量排行</div>
          <div style="height: 350px"></div>
        </el-card>
      </el-col>
      <!-- 分类数据统计 -->
      <el-col :span="8">
        <el-card>
          <div class="e-title">文章分类统计</div>
          <div style="height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <!-- 用户地域分布 -->
      <el-col :span="16">
        <el-card>
          <div class="e-title">用户地域分布</div>
          <div style="height: 350px">
            <div class="area-wrapper">
              <el-radio-group v-model="pageInfo.type">
                <el-radio :label="1">用户</el-radio>
                <el-radio :label="2">游客</el-radio>
              </el-radio-group>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 文章标签统计 -->
      <el-col :span="8">
        <el-card>
          <div class="e-title">文章标签统计</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { MessageBox } from "@element-plus/icons-vue";
import ViewCount from "./components/ViewCount.vue";
const pageInfo = {
  loading: true,
  type: 1,
  viewsCount: 0,
  messageCount: 0,
  userCount: 0,
  articleCount: 0,
  articleStatisticsList: [],
  tagDTOList: [],
};
const ViewCountData = {
  x: [],
  y: [],
};
</script>

<style scoped>
.card-icon-container {
  display: inline-block;
  font-size: 3rem;
}
.area-wrapper {
  display: flex;
  justify-content: center;
}
.card-desc {
  font-weight: bold;
  float: right;
}
.card-title {
  margin-top: 0.3rem;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 1rem;
}
.card-count {
  margin-top: 0.75rem;
  color: #666;
  font-size: 1.25rem;
}
.echarts {
  width: 100%;
  height: 100%;
}
.e-title {
  font-size: 13px;
  color: #202a34;
  font-weight: 700;
}
</style>
