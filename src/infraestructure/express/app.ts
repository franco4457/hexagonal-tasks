import { type ApiExpress, createInMemoryApi } from './api-builder'

export class Applicaction {
  private api!: ApiExpress
  bootstrap(): ApiExpress {
    this.api = createInMemoryApi()
    return this.api
  }
}
export default new Applicaction().bootstrap()
