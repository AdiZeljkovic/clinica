export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  price: number;
  benefits: string[];
  imageUrl: string;
  packaging?: string; // e.g. "30 kapsula", "225 ml"
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  date: string;
}
