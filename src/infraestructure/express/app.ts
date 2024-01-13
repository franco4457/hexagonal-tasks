import type { ApiExpress } from './api'
import { createInMemoryApi, createMongoApi, createPostgresApi } from './dependecies'
import { DIALECT } from '@/config'
export class Applicaction {
  private api!: ApiExpress
  async bootstrap(): Promise<ApiExpress> {
    if (DIALECT === 'MONGODB') this.api = await createMongoApi()
    else if (DIALECT === 'POSTGRES') this.api = await createPostgresApi()
    else this.api = createInMemoryApi()
    return this.api
  }
}
export default new Applicaction().bootstrap()
