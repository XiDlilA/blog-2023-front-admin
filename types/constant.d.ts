export type Tab = {
  name: string;
  path: string;
};

export type User = {
  userInfoId?: string;
  roleList?: string[];
  avatar?: string;
  nickname?: string;
  intro?: string;
  webSite?: string;
};

export type TitleCount = {
  title: string;
  count: number;
};

export type DateCount = {
  date: Date;
  count: number;
};
