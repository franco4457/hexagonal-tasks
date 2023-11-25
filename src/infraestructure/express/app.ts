import type { ApiExpress } from './api'
import { createInMemoryApi, createMongoApi } from './dependecies'
import { DIALECT } from '@/config'
export class Applicaction {
  private api!: ApiExpress
  async bootstrap(): Promise<ApiExpress> {
    if (DIALECT === 'MONGODB') this.api = await createMongoApi()
    else this.api = createInMemoryApi()
    return this.api
  }
}
export default new Applicaction().bootstrap()
