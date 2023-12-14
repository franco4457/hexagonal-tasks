import { type ITask } from '@/domain/task'
import { Column, ManyToOne, PrimaryColumn } from 'typeorm'
import { UserEntity } from '../user/entity'

export class TaskEntity implements ITask {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @ManyToOne(() => UserEntity, (user) => user.id)
  userId: string | null

  constructor(task: ITask) {
    this.id = task.id
    this.title = task.title
    this.description = task.description
    this.userId = task.userId
  }
}
