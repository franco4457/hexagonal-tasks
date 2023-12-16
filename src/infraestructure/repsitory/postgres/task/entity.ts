import { type ITask } from '@/domain/task'
import { Column, PrimaryColumn } from 'typeorm'

export class TaskEntity implements ITask {
  @PrimaryColumn()
  id!: string

  @Column()
  title!: string

  @Column()
  description!: string

  @Column()
  userId!: string | null
}
