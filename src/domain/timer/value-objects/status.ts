import { ValueObject } from '@/domain/core'

export enum StatusEnum {
  PAUSED = 'paused',
  RUNNING = 'running',
  READY = 'ready'
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

  protected validate(value: any): void {
    if (!Object.values(StatusEnum).includes(value)) {
      throw new Error('Invalid timer status')
    }
  }
}
