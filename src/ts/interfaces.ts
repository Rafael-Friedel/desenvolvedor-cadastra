export interface Product {
  id: string;
  name: string;
  price: number;
  parcelamento: Array<number>;
  color: string;
  image: string;
  size: Array<string>;
  date: string;
}

export type PriceRange = {
  label: string;
  value: string;
};

export type ProductFilters = {
  colors: string[];
  sizes: string[];
  prices: string[];
  sortBy: string;
};
