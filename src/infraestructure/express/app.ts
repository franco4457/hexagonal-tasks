import type { ApiExpress } from './api'
import { createInMemoryApi } from './dependecies/in-memory'

export class Applicaction {
  private api!: ApiExpress
  bootstrap(): ApiExpress {
    this.api = createInMemoryApi()
    return this.api
  }
}
export default new Applicaction().bootstrap()
