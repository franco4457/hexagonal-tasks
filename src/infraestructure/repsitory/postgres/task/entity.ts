import { type ITask } from '@/domain/task'
import { Column, PrimaryColumn } from 'typeorm'

export class TaskEntity implements ITask {
  @PrimaryColumn('uuid')
  id!: string

  @Column('varchar', { nullable: false, length: 50 })
  title!: string

  @Column('varchar', { nullable: false, length: 50 })
  description!: string

  @Column('varchar', { nullable: true, length: 50 })
  userId!: string | null
}
