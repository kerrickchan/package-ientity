import { EID } from './eid.type';
import { IEntity } from './entity.interface';
import { IEntityRepository } from './repository.interface';
import { ISortDto } from './pagination.interface';

export class MemoryRepository<T extends IEntity> implements IEntityRepository<T> {
  private entities: T[] = [];

  async findAll(option?: ISortDto): Promise<T[]> {
    let result = [...this.entities];
    if (option?.sort) {
      const [key, order] = Object.entries(option.sort)[0];
      result = result.sort((a, b) => {
        if (a[key] < b[key]) return order === 'ASC' ? -1 : 1;
        return 0;
      });
    }
    return result;
  }

  async findByEid(eid: EID): Promise<T | null> {
    return this.entities.find(entity => entity.eid === eid) || null;
  }

  async findBySqlId(id: number): Promise<T | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async findByNoSqlid(_id: string): Promise<T[]> {
    return this.entities.filter(entity => entity._id === _id);
  }

  async update(entity: Partial<T> & { eid: EID }): Promise<T> {
    const index = this.entities.findIndex(e => e.eid === entity.eid);
    if (index === -1) throw new Error('Entity not found');
    this.entities[index] = { ...this.entities[index], ...entity, updatedAt: new Date() };
    return this.entities[index];
  }

  async remove(eid: EID): Promise<T> {
    const index = this.entities.findIndex(entity => entity.eid === eid);
    if (index === -1) throw new Error('Entity not found');
    const [removed] = this.entities.splice(index, 1);
    return removed;
  }

  async save(entity: T): Promise<T> {
    const newEntity = { ...entity, createdAt: new Date() };
    this.entities.push(newEntity);
    return newEntity;
  }
}
