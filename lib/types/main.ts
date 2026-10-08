export type Menu = {
  label: string;
  url: string;
  sub_menu?: Menu[];
};

export interface IPostMeta {
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  tags?: string[];
}

export interface IPost {
  slug: string;
  meta: IPostMeta;
  content: string;
}
