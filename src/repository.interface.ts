import { EID } from './eid.type';
import { IEntity } from './entity.interface';
import { ISortDto } from './pagination.interface';

export interface IEntityRepository<T extends IEntity> {
  findAll(sort?: ISortDto): Promise<T[]>;
  findByEid(eid: EID): Promise<T | null>;
  update(entity: Partial<T> & { eid: EID }): Promise<T>;
  remove(eid: EID): Promise<T>;
  save(entity: T): Promise<T>;
}

export interface ISqlEntityRepository<T extends IEntity> extends IEntityRepository<T> {
  findBySqlId(id: number): Promise<T | null>;
}

export interface INoSqlEntityRepository<T extends IEntity> extends IEntityRepository<T> {
  findByNoSqlid(_id: string): Promise<T[]>;
}
