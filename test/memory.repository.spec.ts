import { EID, IEntity, MemoryRepository } from '../src';

class TestEntity implements IEntity {
  eid: EID;
  id?: number | undefined;
  _id?: string | undefined;
  createdAt: Date;
  updatedAt?: Date | undefined;
  deletedAt?: Date | null | undefined;
  name: string;
  age: number;
}

describe('MemoryRepository', () => {
  let repository: MemoryRepository<TestEntity>;
  let testEntity1: TestEntity;
  let testEntity2: TestEntity;

  beforeEach(() => {
    repository = new MemoryRepository<TestEntity>();
    testEntity1 = new TestEntity();
    testEntity1.eid = '1';
    testEntity1.name = 'John';
    testEntity1.age = 30;
    testEntity1.createdAt = new Date();
    testEntity2 = new TestEntity();
    testEntity2.eid = 'a';
    testEntity2.name = 'Jane';
    testEntity2.age = 25;
    testEntity2.createdAt = new Date();
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await repository.save(testEntity1);
      await repository.save(testEntity2);
    });

    it('should return all entities without sorting', async () => {
      const result = await repository.findAll();
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(expect.objectContaining(testEntity1));
      expect(result).toContainEqual(expect.objectContaining(testEntity2));
    });

    it('should return entities sorted by name ASC', async () => {
      const result = await repository.findAll({ sort: { name: 'ASC' } });
      expect(result[0].name).toBe('Jane');
      expect(result[1].name).toBe('John');
    });

    it('should return entities sorted by age DESC', async () => {
      const result = await repository.findAll({ sort: { age: 'DESC' } });
      expect(result[0].age).toBe(30);
      expect(result[1].age).toBe(25);
    });
  });

  describe('findByEid', () => {
    beforeEach(async () => {
      await repository.save(testEntity1);
    });

    it('should find an entity by eid', async () => {
      const result = await repository.findByEid('1');
      expect(result).toEqual(expect.objectContaining(testEntity1));
    });

    it('should return null if entity not found', async () => {
      const result = await repository.findByEid('999');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await repository.save(testEntity1);
    });

    it('should update an existing entity', async () => {
      const updatedEntity = await repository.update({ eid: '1', name: 'John Doe' });
      expect(updatedEntity.name).toBe('John Doe');
      expect(updatedEntity.updatedAt).not.toEqual(testEntity1.updatedAt);
    });

    it('should throw an error if entity not found', async () => {
      await expect(repository.update({ eid: '999', name: 'John Doe' })).rejects.toThrow('Entity not found');
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      await repository.save(testEntity1);
    });

    it('should remove an existing entity', async () => {
      const removedEntity = await repository.remove('1');
      expect(removedEntity).toEqual(expect.objectContaining(testEntity1));
      const allEntities = await repository.findAll();
      expect(allEntities).toHaveLength(0);
    });

    it('should throw an error if entity not found', async () => {
      await expect(repository.remove('999')).rejects.toThrow('Entity not found');
    });
  });

  describe('save', () => {
    it('should save a new entity', async () => {
      const savedEntity = await repository.save(testEntity1);
      expect(savedEntity).toEqual(expect.objectContaining(testEntity1));
      expect(savedEntity.createdAt).toBeDefined();
      const allEntities = await repository.findAll();
      expect(allEntities).toHaveLength(1);
    });
  });
});
