import { defineStore } from "pinia";
import type { TitleCount, DateCount } from "#/constant";

export const useHome = defineStore("home", {
  state: () => ({
    articleRankData: [] as TitleCount[],
    viewCountData: [] as DateCount[],
    headMapData: [] as DateCount[],
    categoryData: [] as TitleCount[],
  }),
  actions: {
    updateArticleRankData(articleRankData: TitleCount[]) {
      this.articleRankData = articleRankData;
    },
    updateViewCountData(viewCountData: DateCount[]) {
      this.viewCountData = viewCountData;
    },
    updateHeadMapData(headMapData: DateCount[]) {
      this.headMapData = headMapData;
    },
    updateCategoryData(categoryData: TitleCount[]) {
      this.categoryData = categoryData;
    },
  },
});
