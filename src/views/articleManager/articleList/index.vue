<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <div class="article-status-menu">
      <span style="color: indianred">状态</span>
      <span @click="changeStatus('all')" :style="isActive('all')">全部</span>
      <span @click="changeStatus('public')" :style="isActive('public')">
        公开
      </span>
      <span @click="changeStatus('secret')" :style="isActive('secret')">
        私密
      </span>
      <span @click="changeStatus('draft')" :style="isActive('draft')">
        草稿箱
      </span>
      <span @click="changeStatus('delete')" :style="isActive('delete')">
        回收站
      </span>
    </div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
        v-if="isDelete === 0"
        type="danger"
        size="small"
        icon="Delete"
        :disabled="articleIdList.length === 0"
        @click="updateIsDelete = true"
      >
        批量删除
      </el-button>
      <el-button
        v-else
        type="danger"
        size="small"
        icon="Delete"
        :disabled="articleIdList.length === 0"
        @click="remove = true"
      >
        批量删除
      </el-button>
      <el-button
        type="success"
        size="small"
        icon="Download"
        :disabled="articleIdList.length === 0"
        style="margin-right: 1rem"
        @click="isExport = true"
      >
        批量导出
      </el-button>
      <el-dropdown>
        <el-button
          type="primary"
          size="small"
          icon="Upload"
          style="margin-right: 1rem"
        >
          批量导入
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-upload
                action="/api/admin/articles/import"
                multiple
                :limit="9"
                :show-file-list="false"
                :on-success="uploadArticle"
              >
                普通文章
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item
              ><el-upload
                action="/api/admin/articles/import?type=hexo"
                multiple
                :limit="9"
                :show-file-list="false"
                :on-success="uploadArticle"
              >
                Hexo文章
              </el-upload></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 条件筛选 -->
      <div style="margin-left: auto">
        <!-- 文章类型 -->
        <el-select
          clearable
          v-model="type"
          placeholder="请选择文章类型"
          size="small"
          style="margin-right: 1rem; width: 120px"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 分类 -->
        <el-select
          clearable
          size="small"
          v-model="categoryId"
          filterable
          placeholder="请选择分类"
          style="margin-right: 1rem; width: 100px"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
        <!-- 标签 -->
        <el-select
          clearable
          size="small"
          v-model="tagId"
          filterable
          placeholder="请选择标签"
          style="margin-right: 1rem; width: 100px"
        >
          <el-option
            v-for="item in tagList"
            :key="item.id"
            :label="item.tagName"
            :value="item.id"
          />
        </el-select>
        <!-- 文章名 -->
        <el-input
          clearable
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入文章名"
          style="width: 200px"
          @keyup.enter.native="searchArticles"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 1rem"
          @click="searchArticles"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
      border
      :data="articleList"
      @selection-change="selectionChange"
      lazy
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <!-- 文章修改时间 -->
      <el-table-column
        prop="articleCover"
        label="文章封面"
        width="180"
        align="center"
      >
        <template #default="scope">
          <el-image
            class="article-cover"
            :src="
              scope.row.articleCover
                ? scope.row.articleCover
                : 'https://static.talkxj.com/articles/c5cc2b2561bd0e3060a500198a4ad37d.png'
            "
          />
          <i
            v-if="scope.row.status === 1"
            class="iconfont el-icon-mygongkai article-status-icon"
          />
          <i
            v-if="scope.row.status === 2"
            class="iconfont el-icon-mymima article-status-icon"
          />
          <i
            v-if="scope.row.status === 3"
            class="iconfont el-icon-mycaogaoxiang article-status-icon"
          />
        </template>
      </el-table-column>
      <!-- 文章标题 -->
      <el-table-column prop="articleTitle" label="标题" align="center" />
      <!-- 文章分类 -->
      <el-table-column
        prop="categoryName"
        label="分类"
        width="110"
        align="center"
      />
      <!-- 文章标签 -->
      <el-table-column
        prop="tagDTOList"
        label="标签"
        width="170"
        align="center"
      >
        <template #default="scope">
          <el-tag
            v-for="item of scope.row.tagDTOList"
            :key="item.tagId"
            style="margin-right: 0.2rem; margin-top: 0.2rem"
          >
            {{ item.tagName }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章浏览量 -->
      <el-table-column
        prop="viewsCount"
        label="浏览量"
        width="70"
        align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.viewsCount">
            {{ scope.row.viewsCount }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 文章点赞量 -->
      <el-table-column
        prop="likeCount"
        label="点赞量"
        width="70"
        align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.likeCount">
            {{ scope.row.likeCount }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 文章类型 -->
      <el-table-column prop="type" label="类型" width="80" align="center">
        <template #default="scope">
          <el-tag :type="articleType(scope.row.type).tagType">
            {{ articleType(scope.row.type).name }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 文章发表时间 -->
      <el-table-column
        prop="createTime"
        label="发表时间"
        width="130"
        align="center"
      >
        <template #default="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <!-- 文章置顶 -->
      <el-table-column prop="isTop" label="置顶" width="80" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isTop"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :disabled="scope.row.isDelete === 1"
            :active-value="1"
            :inactive-value="0"
            @change="changeTop(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="editArticle(scope.row.id)"
            v-if="scope.row.isDelete === 0"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left: 10px"
            @confirm="updateArticleDelete(scope.row.id)"
            v-if="scope.row.isDelete === 0"
          >
            <el-button size="small" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
          <el-popconfirm
            title="确定恢复吗？"
            v-if="scope.row.isDelete === 1"
            @confirm="updateArticleDelete(scope.row.id)"
          >
            <el-button size="small" type="success" slot="reference">
              恢复
            </el-button>
          </el-popconfirm>
          <el-popconfirm
            style="margin-left: 10px"
            v-if="scope.row.isDelete === 1"
            title="确定彻底删除吗？"
            @confirm="deleteArticles(scope.row.id)"
          >
            <el-button size="small" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import request from "../../../utils/request";
const route = useRoute();
const router = useRouter();
const loading = true;
let updateIsDelete = false;
let remove = false;
const typeList = [
  {
    value: 1,
    label: "原创",
  },
  {
    value: 2,
    label: "转载",
  },
  {
    value: 3,
    label: "翻译",
  },
];
let activeStatus = ref("all");
const articleList = [];
let articleIdList = [];
const categoryList = [];
const tagList = [];
const keywords = null;
const type = null;
const categoryId = null;
const tagId = null;
let isDelete = 0;
const isExport = false;
let status = null;
let current = 1;
const size = 10;
const count = 0;
function deleteArticles(id) {
  let param = {};
  if (id == null) {
    param = { data: articleIdList };
  } else {
    param = { data: [id] };
  }
  request.delete("/api/admin/articles", param).then(({ data }) => {
    if (data.flag) {
      console.log({
        title: "成功",
        message: data.message,
      });
      listArticles();
    } else {
      console.log({
        title: "失败",
        message: data.message,
      });
    }
    remove = false;
  });
}
function updateArticleDelete(id) {
  let param = {};
  if (id != null) {
    param.idList = [id];
  } else {
    param.idList = articleIdList;
  }
  param.isDelete = isDelete === 0 ? 1 : 0;
  request.put("/api/admin/articles", param).then(({ data }) => {
    if (data.flag) {
      console.log({
        title: "成功",
        message: data.message,
      });
      listArticles();
    } else {
      console.log({
        title: "失败",
        message: data.message,
      });
    }
    updateIsDelete = false;
  });
}
function editArticle(id) {
  router.push({ path: "/articles/" + id });
}
function changeTop(article) {
  request
    .put("/api/admin/articles/top", {
      id: article.id,
      isTop: article.isTop,
    })
    .then(({ data }) => {
      if (data.flag) {
        console.log({
          title: "成功",
          message: "置顶成功",
        });
      } else {
        console.log({
          title: "失败",
          message: data.message,
        });
      }
      remove = false;
    });
}
function selectionChange(articleList) {
  articleIdList = [];
  articleList.forEach((item) => {
    articleIdList.push(item.id);
  });
}
function changeStatus(actStatus) {
  switch (actStatus) {
    case "all":
      isDelete = 0;
      status = null;
      break;
    case "public":
      isDelete = 0;
      status = 1;
      break;
    case "secret":
      isDelete = 0;
      status = 2;
      break;
    case "draft":
      isDelete = 0;
      status = 3;
      break;
    case "delete":
      isDelete = 1;
      status = null;
      break;
  }
  current = 1;
  activeStatus.value = actStatus;
}
function searchArticles() {
  current = 1;
  listArticles();
}
function listArticles() {
  request
    .get("/api/admin/articles", {
      params: {
        current: this.current,
        size: this.size,
        keywords: this.keywords,
        categoryId: this.categoryId,
        status: this.status,
        tagId: this.tagId,
        type: this.type,
        isDelete: this.isDelete,
      },
    })
    .then(({ data }) => {
      this.articleList = data.data.recordList;
      this.count = data.data.count;
      this.loading = false;
    });
}
function uploadArticle(data) {
  if (data.flag) {
    console.log({
      title: "成功",
      message: "导入成功",
    });
    listArticles();
  } else {
    console.log({
      title: "失败",
      message: data.message,
    });
  }
}
const articleType = computed(() => {
  return function (type) {
    let tagType = "";
    let name = "";
    switch (type) {
      case 1:
        tagType = "danger";
        name = "原创";
        break;
      case 2:
        tagType = "success";
        name = "转载";
        break;
      case 3:
        tagType = "primary";
        name = "翻译";
        break;
    }
    return {
      tagType: tagType,
      name: name,
    };
  };
});
const isActive = computed(() => {
  return function (status) {
    return {
      cursor: "pointer",
      color: activeStatus.value === status ? "#333" : "#999",
      "font-weight": activeStatus.value === status ? "bold" : "normal",
    };
  };
});
</script>

<style scoped>
.operation-container {
  margin-top: 1.5rem;
}
.article-status-menu {
  font-size: 14px;
  margin-top: 40px;
  color: #999;
}
.article-status-menu span {
  margin-right: 24px;
}
.status {
  cursor: pointer;
}
.active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}
.article-cover {
  position: relative;
  width: 100%;
  height: 90px;
  border-radius: 4px;
}
.article-cover::after {
  content: "";
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.article-status-icon {
  color: #fff;
  font-size: 1.5rem;
  position: absolute;
  right: 1rem;
  bottom: 1.4rem;
}
</style>
