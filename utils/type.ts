export interface Collection {
  pagination: {
    page: number,
    total: number,
    total_pages: number
  },
  images: Array<Image>,
}

export interface Image {
  id: string;
  file_name: string;
  prompt: string;
  createdAt: string;
  is_visible: boolean;
  error?: string;
  loading?: boolean;
}