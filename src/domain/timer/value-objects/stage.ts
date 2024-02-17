import { ValueObject } from '@/domain/core'
import { InvalidStage } from '../timer.exceptions'

export enum StageEnum {
  SHORT_BREAK = 'short_break',
  LONG_BREAK = 'long_break',
  POMODORO = 'pomodoro'
}
const stageEnumKeys: Record<StageEnum, keyof typeof StageEnum> = {
  [StageEnum.SHORT_BREAK]: 'SHORT_BREAK',
  [StageEnum.LONG_BREAK]: 'LONG_BREAK',
  [StageEnum.POMODORO]: 'POMODORO'
}

export interface StageProps {
  stageInterval: number
  currentStage: StageEnum
}

export class Stage extends ValueObject<StageProps> {
  static create(props: Partial<StageProps>): Stage {
    return new Stage({
      stageInterval: props.stageInterval ?? 4,
      currentStage: props.currentStage ?? StageEnum.POMODORO
    })
  }

  get stageInterval(): number {
    return this.value.stageInterval
  }

  get currentStage(): StageEnum {
    return this.value.currentStage
  }

  getCurrentStageKey(): keyof typeof StageEnum {
    return stageEnumKeys[this.currentStage]
  }

  protected validate(value: StageProps): void {
    if (value.stageInterval < 0) {
      throw new InvalidStage('Stage interval must be greater than 0')
    }
    if (!Object.values(StageEnum).includes(value.currentStage)) {
      throw new InvalidStage('Invalid stage')
    }
  }
}
