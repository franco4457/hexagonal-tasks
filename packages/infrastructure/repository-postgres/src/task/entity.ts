import { type TaskModel } from '@domain/task'
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class TaskEntity extends BaseEntity implements TaskModel {
  @PrimaryColumn('uuid', { unique: true, nullable: false })
  id!: string

  @Column('varchar', { nullable: false, length: 50 })
  title!: string

  @Column('varchar', { nullable: false, length: 50 })
  description!: string

  @Column('varchar', { nullable: true, length: 50 })
  userId!: string | null
}
