import { ID } from './id.type';
import { IEntity } from './entity.interface';
import { ISortDto } from './pagination.interface';

export interface IRepository<T extends IEntity> {
  findAll(sort?: ISortDto): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  update(entity: Partial<Omit<T, 'eid'>> & { id: number, _id: string }): Promise<T>;
  remove(id: ID): Promise<T>;
  save(entity: T): Promise<T>;
}
