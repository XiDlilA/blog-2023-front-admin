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
        :disabled="categoryIdList.length === 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入分类名"
          style="width: 200px"
          @keyup.enter.native="searchCategories"
        />
        <el-button
          type="primary"
          size="small"
          icon="Search"
          style="margin-left: 1rem"
          @click="searchCategories"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
      border
      :data="categoryList.value"
      @selection-change="selectionChange"
      lazy
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <!-- 分类名 -->
      <el-table-column prop="categoryName" label="分类名" align="center" />
      <!-- 文章量 -->
      <el-table-column prop="articleCount" label="文章量" align="center" />
      <!-- 分类创建时间 -->
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
            @confirm="deleteCategory(scope.row.id)"
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
        <el-button type="primary" @click="deleteCategory(null)">
          确 定
        </el-button>
      </template>
    </el-dialog>
    <!-- 添加编辑对话框 -->
    <el-dialog v-model="addOrEdit" width="30%">
      <template #header class="dialog-title-container">{{
        categoryTitle
      }}</template>
      <el-form label-width="80px" size="default" :model="categoryForm">
        <el-form-item label="分类名">
          <el-input v-model="categoryForm.categoryName" style="width: 220px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="unableAddOrEdit">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory"> 确 定 </el-button>
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
let categoryIdList = [];
let categoryList = ref([]);
let categoryTitle = ref("");
let categoryForm = {
  id: null,
  categoryName: "",
};
let current = 1;
let size = 10;
let count = 0;
const route = useRoute();
function unableAddOrEdit() {
  addOrEdit.value = false;
}
function selectionChange(categoryListC) {
  categoryIdList = [];
  categoryListC.forEach((item) => {
    categoryIdList.push(item.id);
  });
}
function openModel(category) {
  if (category != null) {
    categoryForm = JSON.parse(JSON.stringify(category));
    categoryTitle.value = "修改分类";
  } else {
    categoryForm.id = null;
    categoryForm.categoryName = "";
    categoryTitle.value = "添加分类";
  }
  addOrEdit.value = true;
}
function listCategories() {
  request
    .get("/api/admin/categories", {
      params: {
        current: current,
        size: size,
        keywords: keywords,
      },
    })
    .then(({ data }) => {
      categoryList.value = data.data.recordList;
      count = data.data.count;
      loading = false;
    });
}
function searchCategories() {
  current = 1;
  listCategories();
}
function addOrEditCategory() {
  if (categoryForm.categoryName.trim() === "") {
    console.log("分类名不能为空");
    return false;
  }
  request.post("/api/admin/categories", categoryForm).then(({ data }) => {
    if (data.flag) {
      console.log({
        title: "成功",
        message: data.message,
      });
      listCategories();
    } else {
      console.log({
        title: "失败",
        message: data.message,
      });
    }
    addOrEdit.value = false;
  });
}
function deleteCategory(id) {
  let param = {};
  if (id == null) {
    param = { data: categoryIdList };
  } else {
    param = { data: [id] };
  }
  request.delete("/api/admin/categories", param).then(({ data }) => {
    if (data.flag) {
      console.log({
        title: "成功",
        message: data.message,
      });
      listCategories();
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
  listCategories();
}
function currentChange(currentC) {
  current = currentC;
  listCategories();
}
</script>

<style scoped></style>
