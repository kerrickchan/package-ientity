import { EID } from './eid.type';
import { IEntity } from './entity.interface';
import { ISqlEntityRepository } from './repository.interface';
import { ISortDto } from './pagination.interface';

export abstract class SqlRepository<T extends IEntity> implements ISqlEntityRepository<T> {
  protected abstract tableName: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract db: any;

  async findAll(sort?: ISortDto): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: string[] = [];

    if (sort && Object.keys(sort).length > 0) {
      const orderByClause = Object.entries(sort)
        .map(([key, order]) => {
          params.push(key);
          return `$${params.length} ${order}`;
        })
        .join(', ');

      query += ` ORDER BY ${orderByClause}`;
    }

    const result = await this.db.query(query, params);
    return result.rows;
  }

  async findByEid(eid: EID): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE eid = $1`;
    const result = await this.db.query(query, [eid]);
    return result.rows[0] || null;
  }

  async findBySqlId(id: number): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async update(entity: Partial<T> & { eid: EID }): Promise<T> {
    const entries = Object.entries(entity).filter(([key]) => key !== 'eid');
    const setClauses = entries.map((_, index) => `${entries[index][0]} = $${index + 2}`);
    const query = `
      UPDATE ${this.tableName}
      SET ${setClauses.join(', ')}, updated_at = NOW()
      WHERE eid = $1
      RETURNING *
    `;
    const values = [entity.eid, ...entries.map(([, value]) => value)];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async remove(eid: EID): Promise<T> {
    const query = `DELETE FROM ${this.tableName} WHERE eid = $1 RETURNING *`;
    const result = await this.db.query(query, [eid]);
    return result.rows[0];
  }

  async save(entity: T): Promise<T> {
    const entries = Object.entries(entity);
    const columns = entries.map(([key]) => key).join(', ');
    const placeholders = entries.map((_, index) => `$${index + 1}`).join(', ');
    const query = `
      INSERT INTO ${this.tableName} (${columns}, created_at)
      VALUES (${placeholders}, NOW())
      RETURNING *
    `;
    const values = entries.map(([, value]) => value);
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
}
