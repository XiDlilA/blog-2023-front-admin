<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <div class="article-title-container">
      <el-input
        v-model="article.articleTitle"
        size="default"
        placeholder="输入文章标题"
      />
      <el-button
        type="danger"
        size="default"
        class="save-btn"
        @click="saveArticleDraft"
        v-if="article.id == null || article.status === 3"
      >
        保存草稿
      </el-button>
      <el-button
        type="danger"
        size="default"
        @click="openModel"
        style="margin-left: 10px"
      >
        发布文章
      </el-button>
    </div>
    <mavon-editor
      ref="md"
      v-model="article.articleContent"
      @imgAdd="uploadImg"
      style="height: calc(100vh - 260px)"
    />
    <el-dialog v-model="addOrEdit" width="40%" top="3vh">
      <template #header class="dialog-title-container">发布文章</template>
      <!-- 文章数据 -->
      <el-form label-width="80px" size="default" :model="article">
        <!-- 文章分类 -->
        <el-form-item label="文章分类">
          <el-tag
            type="success"
            v-show="article.categoryName"
            style="margin: 0 1rem 0 0"
            :closable="true"
            @close="removeCategory"
          >
            {{ article.categoryName }}
          </el-tag>
          <!-- 分类选项 -->
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            v-if="!article.categoryName"
          >
            <div class="popover-title">分类</div>
            <!-- 搜索框 -->
            <el-autocomplete
              style="width: 100%"
              v-model="categoryName"
              :fetch-suggestions="searchCategories"
              placeholder="请输入分类名搜索，enter可添加自定义分类"
              :trigger-on-focus="false"
              @keyup.enter.native="saveCategory"
              @select="handleSelectCategories"
            >
              <template #default="{ item }">
                <div>{{ item.categoryName }}</div>
              </template>
            </el-autocomplete>
            <!-- 分类 -->
            <div class="popover-container">
              <div
                v-for="item of categoryList"
                :key="item.id"
                class="category-item"
                @click="addCategory(item)"
              >
                {{ item.categoryName }}
              </div>
            </div>
            <el-button type="success" plain slot="reference" size="small">
              添加分类
            </el-button>
          </el-popover>
        </el-form-item>
        <!-- 文章标签 -->
        <el-form-item label="文章标签">
          <el-tag
            v-for="(item, index) of article.tagNameList"
            :key="index"
            style="margin: 0 1rem 0 0"
            :closable="true"
            @close="removeTag(item)"
          >
            {{ item }}
          </el-tag>
          <!-- 标签选项 -->
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            v-if="article.tagNameList.length < 3"
          >
            <div class="popover-title">标签</div>
            <!-- 搜索框 -->
            <el-autocomplete
              style="width: 100%"
              v-model="tagName"
              :fetch-suggestions="searchTags"
              placeholder="请输入标签名搜索，enter可添加自定义标签"
              :trigger-on-focus="false"
              @keyup.enter.native="saveTag"
              @select="handleSelectTag"
            >
              <template #default="{ item }">
                <div>{{ item.tagName }}</div>
              </template>
            </el-autocomplete>
            <!-- 标签 -->
            <div class="popover-container">
              <div style="margin-bottom: 1rem">添加标签</div>
              <el-tag
                v-for="(item, index) of tagList"
                :key="index"
                :class="tagClass(item)"
                @click="addTag(item)"
              >
                {{ item.tagName }}
              </el-tag>
            </div>
            <el-button type="primary" plain slot="reference" size="small">
              添加标签
            </el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-model="article.type" placeholder="请选择类型">
            <el-option
              v-for="item in typeList"
              :key="item.type"
              :label="item.desc"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <!-- 文章类型 -->
        <el-form-item label="原文地址" v-if="article.type !== 1">
          <el-input
            v-model="article.originalUrl"
            placeholder="请填写原文链接"
          />
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload
            class="upload-cover"
            drag
            action="/api/admin/articles/images"
            multiple
            :before-upload="beforeUpload"
            :on-success="uploadCover"
          >
            <i class="el-icon-upload" v-if="article.articleCover === ''" />
            <div class="el-upload__text" v-if="article.articleCover === ''">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img
              v-else
              :src="article.articleCover"
              width="360px"
              height="180px"
              alt="上传"
            />
          </el-upload>
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch
            v-model="article.isTop"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="发布形式">
          <el-radio-group v-model="article.status">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="2">私密</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="danger" @click="saveOrUpdateArticle">
          发 表
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
// todo: dialog 延迟响应，需要定位问题！
import dayjs from "dayjs";
import { useTab } from "../../../stores/tab";
import request from "../../../utils/request";
import * as imageConversion from "image-conversion";
import config from "../../../assets/js/config";
const router = useRouter();
const route = useRoute();
const tabManager = useTab();
let addOrEdit = ref(false);
let autoSave = true;
let categoryName = "";
let tagName = "";
let categoryList = [];
const tagList = [];
const typeList = [
  {
    type: 1,
    desc: "原创",
  },
  {
    type: 2,
    desc: "转载",
  },
  {
    type: 3,
    desc: "翻译",
  },
];
const article = reactive({
  id: null,
  articleTitle: dayjs(new Date()).format("YYYY-MM-DD"),
  articleContent: "",
  articleCover: "",
  categoryName: null,
  tagNameList: [],
  originalUrl: "",
  isTop: 0,
  type: 1,
  status: 1,
});
function listCategories() {
  request.get("/api/admin/categories/search").then(({ data }) => {
    categoryList = data.data;
  });
}
function listTags() {
  request.get("/api/admin/tags/search").then(({ data }) => {
    this.tagList = data.data;
  });
}
function saveOrUpdateArticle() {
  if (article.articleTitle.trim() === "") {
    console.log("文章标题不能为空");
    return false;
  }
  if (article.articleContent.trim() === "") {
    console.log("文章内容不能为空");
    return false;
  }
  if (article.categoryName == null) {
    console.log("文章分类不能为空");
    return false;
  }
  if (article.tagNameList.length === 0) {
    console.log("文章标签不能为空");
    return false;
  }
  if (article.articleCover.trim() === "") {
    console.log("文章封面不能为空");
    return false;
  }
  this.axios.post("/api/admin/articles", article).then(({ data }) => {
    if (data.flag) {
      if (article.id === null) {
        tabManager.removeTab("发布文章");
      } else {
        tabManager.removeTab("修改文章");
      }
      sessionStorage.removeItem("article");
      router.push({ path: "/article-list" });
      console.log({
        title: "成功",
        message: data.message,
      });
    } else {
      console.log({
        title: "失败",
        message: data.message,
      });
    }
    addOrEdit = false;
  });
  //关闭自动保存功能
  autoSave = false;
}
function saveArticleDraft() {
  // todo: 将 message 包装
  if (article.articleTitle.trim() === "") {
    console.log("文章标题不能为空");
    return false;
  }
  if (article.articleContent.trim() === "") {
    console.log("文章内容不能为空");
    return false;
  }
  article.status = 3;
  request.post("/api/admin/articles", article).then(({ data }) => {
    if (data.flag) {
      if (article.id === null) {
        tabManager.removeTab("发布文章");
      } else {
        tabManager.removeTab("修改文章");
      }
      sessionStorage.removeItem("article");
      router.push({ path: "/article-list" });
      console.log({
        title: "成功",
        message: "保存草稿成功",
      });
    } else {
      console.log({
        title: "失败",
        message: "保存草稿失败",
      });
    }
  });
  //关闭自动保存功能
  autoSave = false;
}
function openModel() {
  if (article.articleTitle.trim() === "") {
    console.log("文章标题不能为空");
    return false;
  }
  if (article.articleContent.trim() === "") {
    console.log("文章内容不能为空");
    return false;
  }
  // listCategories();
  // listTags();
  addOrEdit = true;
}
function uploadCover(response) {
  article.articleCover = response.data;
}
function beforeUpload(file) {
  return new Promise((resolve) => {
    if (file.size / 1024 < config.UPLOAD_SIZE) {
      resolve(file);
    }
    // 压缩到200KB,这里的200就是要压缩的大小,可自定义
    imageConversion.compressAccurately(file, config.UPLOAD_SIZE).then((res) => {
      resolve(res);
    });
  });
}
function uploadImg(pos, file) {
  const formData = new FormData();
  if (file.size / 1024 < config.UPLOAD_SIZE) {
    formData.append("file", file);
    request.post("/api/admin/articles/images", formData).then(({ data }) => {
      this.$refs.md.$img2Url(pos, data.data);
    });
  } else {
    // 压缩到200KB,这里的200就是要压缩的大小,可自定义
    imageConversion.compressAccurately(file, config.UPLOAD_SIZE).then((res) => {
      formData.append(
        "file",
        new window.File([res], file.name, { type: file.type })
      );
      request.post("/api/admin/articles/images", formData).then(({ data }) => {
        this.$refs.md.$img2Url(pos, data.data);
      });
    });
  }
}
function removeCategory() {
  article.categoryName = null;
}
function searchCategories(keywords, cb) {
  request
    .get("/api/admin/categories/search", {
      params: {
        keywords: keywords,
      },
    })
    .then(({ data }) => {
      cb(data.data);
    });
}
function saveCategory() {
  if (categoryName.trim() !== "") {
    addCategory({
      categoryName: categoryName,
    });
    categoryName = "";
  }
}
function addCategory(item) {
  article.categoryName = item.categoryName;
}
function handleSelectCategories(item) {
  addCategory({
    categoryName: item.categoryName,
  });
}
function searchTags(keywords, cb) {
  request
    .get("/api/admin/tags/search", {
      params: {
        keywords: keywords,
      },
    })
    .then(({ data }) => {
      cb(data.data);
    });
}
function handleSelectTag(item) {
  addTag({
    tagName: item.tagName,
  });
}
function saveTag() {
  if (tagName.trim() !== "") {
    addTag({
      tagName: tagName,
    });
    tagName = "";
  }
}
function removeTag(item) {
  const index = article.tagNameList.indexOf(item);
  article.tagNameList.splice(index, 1);
}
function addTag(item) {
  if (article.tagNameList.indexOf(item.tagName) === -1) {
    article.tagNameList.push(item.tagName);
  }
}
const tagClass = computed(() => {
  return function (item) {
    const index = this.article.tagNameList.indexOf(item.tagName);
    return index !== -1 ? "tag-item-select" : "tag-item";
  };
});
</script>

<style scoped>
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}
.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}
.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}
.category-item {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}
.category-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}
.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}
.popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}
</style>
