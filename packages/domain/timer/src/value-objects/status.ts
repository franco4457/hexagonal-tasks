import { ValueObject } from '@domain/core'

export enum StatusEnum {
  PAUSED = 'paused',
  RUNNING = 'running',
  READY = 'ready'
}
const statusValues: Record<StatusEnum, keyof typeof StatusEnum> = {
  [StatusEnum.PAUSED]: 'PAUSED',
  [StatusEnum.RUNNING]: 'RUNNING',
  [StatusEnum.READY]: 'READY'
}
export class Status extends ValueObject<StatusEnum> {
  public static create(): Status {
    const status = new Status(StatusEnum.READY)
    return status
  }

  isPaused(): boolean {
    return this.value === StatusEnum.PAUSED
  }

  isRunning(): boolean {
    return this.value === StatusEnum.RUNNING
  }

  isReady(): boolean {
    return this.value === StatusEnum.READY
  }

  getStatusKey(): keyof typeof StatusEnum {
    return statusValues[this.value]
  }

  protected validate(value: any): void {
    if (!Object.values(StatusEnum).includes(value)) {
      throw new Error('Invalid timer status')
    }
  }
}
