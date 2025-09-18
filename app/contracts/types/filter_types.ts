export type Filters = {
  where?: Array<Filter>,
  like?: Array<Filter>,
  whereIn?: Array<Filter>,
  dateBetween?: Array<DateFilter>,
  relationsWhere?: Array<Filter>,
  relationsLike?: Array<Filter>,
  sortable?: Array<string>,
}


export enum SortType {
  ASC ='asc',
  DESC = 'desc'
}

export type Filter = {
  name: string,
  type: FilterType,
  paramName?:string
  deep?: number,
}

export type DateFilter = {
  name: string,
  startName: string,
  endName: string,
}

export enum FilterType {
  STRING = 'string',
  NUMBER = 'number',
  BOOL = 'bool',
  ARRAY = 'array',
}

export interface PaginationData {
  page: number,
  perPage: number
}

