<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
        type="primary"
        size="small"
        icon="Plus"
        @click="openModel(null)"
      >
        新增
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        :disabled="tagIdList.length === 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入标签名"
          style="width: 200px"
          @keyup.enter.native="searchTags"
        />
        <el-button
          type="primary"
          size="small"
          icon="Search"
          style="margin-left: 1rem"
          @click="searchTags"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
      border
      :data="tagList.value"
      @selection-change="selectionChange"
      lazy
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <!-- 标签名 -->
      <el-table-column prop="tagName" label="标签名" align="center" />
      <!-- 文章量 -->
      <el-table-column prop="articleCount" label="文章量" align="center" />
      <!-- 标签创建时间 -->
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template #default="scope">
          <i class="el-icon-time" style="margin-right: 5px" />
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openModel(scope.row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left: 1rem"
            @confirm="deleteTag(scope.row.id)"
          >
            <el-button size="small" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="current"
      v-model:page-size="size"
      :page-sizes="[10, 20]"
      :total="count"
      background
      class="pagination-container"
      layout="total,sizes,prev,pager,next,jumper"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 批量删除对话框 -->
    <el-dialog v-model="isDelete" width="30%">
      <template #header class="dialog-title-container">
        <i class="el-icon-warning" style="color: #ff9900" />提示
      </template>
      <div style="font-size: 1rem">是否删除选中项？</div>
      <template #footer>
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteTag(null)"> 确 定 </el-button>
      </template>
    </el-dialog>
    <!-- 添加编辑对话框 -->
    <el-dialog v-model="addOrEdit" width="30%">
      <template #header class="dialog-title-container">{{ tagTitle }}</template>
      <el-form label-width="80px" size="default" :model="tagForm">
        <el-form-item label="标签名">
          <el-input v-model="tagForm.tagName" style="width: 220px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="unableAddOrEdit">取 消</el-button>
        <el-button type="primary" @click="addOrEditTag"> 确 定 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import request from "../../../utils/request";
let isDelete = false;
let loading = true;
let addOrEdit = ref(false);
const keywords = ref(null);
let tagIdList = [];
let tagList = ref([]);
let tagTitle = ref("");
let tagForm = {
  id: null,
  tagName: "",
};
let current = 1;
let size = 10;
let count = 0;
const route = useRoute();
function unableAddOrEdit() {
  addOrEdit.value = false;
}
function selectionChange(categoryListC) {
  tagIdList = [];
  categoryListC.forEach((item) => {
    tagIdList.push(item.id);
  });
}
function openModel(category) {
  if (category != null) {
    tagForm = JSON.parse(JSON.stringify(category));
    tagTitle.value = "修改标签";
  } else {
    tagForm.id = null;
    tagForm.tagName = "";
    tagTitle.value = "添加标签";
  }
  addOrEdit.value = true;
}
function listTags() {
  request
    .get("/api/admin/tags", {
      params: {
        current: current,
        size: size,
        keywords: keywords,
      },
    })
    .then(({ data }) => {
      tagList.value = data.data.recordList;
      count = data.data.count;
      loading = false;
    });
}
function searchTags() {
  current = 1;
  listTags();
}
function addOrEditTag() {
  if (tagForm.tagName.trim() === "") {
    console.log("标签名不能为空");
    return false;
  }
  request.post("/api/admin/tags", tagForm).then(({ data }) => {
    if (data.flag) {
      console.log({
        title: "成功",
        message: data.message,
      });
      listTags();
    } else {
      console.log({
        title: "失败",
        message: data.message,
      });
    }
    addOrEdit.value = false;
  });
}
function deleteTag(id) {
  let param = {};
  if (id == null) {
    param = { data: tagIdList };
  } else {
    param = { data: [id] };
  }
  request.delete("/api/admin/tags", param).then(({ data }) => {
    if (data.flag) {
      console.log({
        title: "成功",
        message: data.message,
      });
      listTags();
    } else {
      console.log({
        title: "失败",
        message: data.message,
      });
    }
    isDelete = false;
  });
}
function sizeChange(sizeC) {
  size = sizeC;
  listTags();
}
function currentChange(currentC) {
  current = currentC;
  listTags();
}
</script>

<style scoped></style>
