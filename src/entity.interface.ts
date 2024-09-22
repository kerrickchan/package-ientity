import { EID } from './eid.type';

export interface IEntity {
  eid: EID;
  id?: number;
  _id?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
