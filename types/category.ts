export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  productCount?: number
  createdAt: string
  updatedAt: string
}

export interface CategoryWithChildren extends Category {
  children: Category[]
}

export interface CategoryTree {
  [key: string]: CategoryWithChildren
}

// Category filter options
export interface CategoryFilter {
  categoryId?: string
  includeInactive?: boolean
  sortBy?: 'name' | 'productCount' | 'sortOrder'
  sortOrder?: 'asc' | 'desc'
}
