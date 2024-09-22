export interface ISortDto {
  sort?: {
    [key: string]: "ASC" | "DESC";
  };
}

export interface IPaginationDto extends ISortDto {
  size: number;
  page: number;
}

export interface ICursorDto extends ISortDto {
  size: number;
  cursor: string;
}

export interface ISqlEntityPagination {
  limit: number;
  offset: number;
  sort?: { [key: string]: "ASC" | "DESC" };
}

export interface INoSqlEntityPagination {
  skip: number;
  take: number;
  sort?: { [key: string]: 1 | -1 };
}
