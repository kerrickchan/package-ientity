import { ID } from './id.type';

export interface IEntity {
  eid: ID;
  id?: number;
  _id?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
