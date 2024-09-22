import { EID } from './eid.type';
import { IEntity } from './entity.interface';
import { INoSqlEntityRepository } from './repository.interface';
import { ISortDto } from './pagination.interface';

export abstract class NoSqlRepository<T extends IEntity> implements INoSqlEntityRepository<T> {
  protected abstract collectionName: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract db: any

  async findAll(sort?: ISortDto): Promise<T[]> {
    const collection = this.db.collection(this.collectionName);
    let query = collection.find();

    if (sort?.sort) {
      const [key, order] = Object.entries(sort.sort)[0];
      query = query.sort({ [key]: order === 'ASC' ? 1 : -1 });
    }

    return query.toArray();
  }

  async findByEid(eid: EID): Promise<T | null> {
    const collection = this.db.collection(this.collectionName);
    return collection.findOne({ eid });
  }

  async findByNoSqlid(_id: string): Promise<T[]> {
    const collection = this.db.collection(this.collectionName);
    return collection.find({ _id }).toArray();
  }

  async update(entity: Partial<T> & { eid: EID }): Promise<T> {
    const collection = this.db.collection(this.collectionName);
    const result = await collection.findOneAndUpdate(
      { eid: entity.eid },
      { $set: { ...entity, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  async remove(eid: EID): Promise<T> {
    const collection = this.db.collection(this.collectionName);
    const result = await collection.findOneAndDelete({ eid });
    return result.value;
  }

  async save(entity: T): Promise<T> {
    const collection = this.db.collection(this.collectionName);
    const newEntity = { ...entity, createdAt: new Date() };
    const result = await collection.insertOne(newEntity);
    return { ...newEntity, _id: result.insertedId };
  }
}
