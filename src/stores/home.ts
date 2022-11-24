import { defineStore } from "pinia";
import type { ArticleRank, DateCount } from "#/constant";

export const useHome = defineStore("home", {
  state: () => ({
    articleRankData: [] as ArticleRank[],
    viewCountData: [] as DateCount[],
    headMapData: [] as DateCount[],
  }),
  actions: {
    updateArticleRankData(articleRankData: ArticleRank[]) {
      this.articleRankData = articleRankData;
    },
    updateViewCountData(viewCountData: DateCount[]) {
      this.viewCountData = viewCountData;
    },
    updateHeadMapData(headMapData: DateCount[]) {
      this.headMapData = headMapData;
    },
  },
});
