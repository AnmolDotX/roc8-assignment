export interface Category {
    id: number;
    name: string;
    isChecked: boolean;
  }
  
export  interface PaginatedCategoryResponseInterface {
    success: boolean;
    data: {
      categories: Category[];
      pagination: {
        totalPages: number;
      };
    };
    message?: string;
  }