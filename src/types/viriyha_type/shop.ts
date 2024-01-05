export type ShopManagementType = {
  id: string | number | undefined;
  image: string;
  name: string;
  description?: string;
  rating?: number;
  discount?: number;
  salePrice?: number;
  offerPrice?: number;
  gender?: string;
  categories?: string[];
  colors?: string[];
  popularity?: number;
  date?: number;
  created: Date;
  isStock?: boolean;
  new?: number;
};
