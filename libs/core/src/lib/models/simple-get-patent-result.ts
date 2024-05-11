import { Pagination } from './paging-info';
import { Patent } from './patent.model';

export interface SimpleGetPatentResult {
  pagination: Pagination;
  content: Patent[];
}
