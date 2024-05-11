export interface PatentSimpleSearchRequest {
  keyword: string;
  page: number;
  size: number;
  orderBy?: string;
  orderType?: string;
}
