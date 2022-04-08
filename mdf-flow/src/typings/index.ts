export interface DataItem {
  title: string;
  description: string;
  link: string;
}

export interface Data {
  data: DataItem[];
  method: string;
}