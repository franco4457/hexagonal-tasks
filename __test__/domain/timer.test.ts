import {
  StatusEnum,
  Timer,
  Status,
  Duration,
  Stage,
  type TimerCreateEvent,
  TimerStartEvent,
  TimerStopEvent,
  TimerResumeEvent,
  StageEnum,
  TimerFinishEvent,
  InvalidCurrentStage,
  TimerFieldRequired,
  TimerChangeStageEvent
} from '@/domain/timer'
import { TEST_ID } from '../utils'
import { ValidationError } from '@/domain/core'

const TEST_STATUS = new Status(StatusEnum.READY)
const TEST_DURATION = Duration.create({})
const TEST_STAGE = Stage.create({})
const TEST_PROPS = {
  userId: TEST_ID,
  currentTaskId: null,
  startedAt: 0,
  stoppedAt: 0,
  pomodoroCounter: 0,
  stage: TEST_STAGE,
  duration: TEST_DURATION,
  status: TEST_STATUS
}

describe.concurrent('Timer Domain', () => {
  it.concurrent('Should create a timer intance', async () => {
    const timer = new Timer({
      id: TEST_ID,
      props: TEST_PROPS
    })
    expect(timer).toBeInstanceOf(Timer)
    expect(timer.id).toBe(TEST_ID)
    expect(timer.createdAt).toBeInstanceOf(Date)
    expect(timer.updatedAt).toBeInstanceOf(Date)

    const now = timer.updatedAt
    expect(timer.getProps()).toStrictEqual({
      ...TEST_PROPS,
      createdAt: now,
      updatedAt: now,
      id: TEST_ID
    })
  })
  it.concurrent('Should create a timer instace with create method', async () => {
    const timer = Timer.create({
      userId: TEST_ID
    })
    expect(timer).toBeInstanceOf(Timer)
    expect(timer.id).toBeDefined()
    expect(timer.createdAt).toBeInstanceOf(Date)
    expect(timer.updatedAt).toBeInstanceOf(Date)
    const now = timer.updatedAt
    expect(timer.getProps()).toStrictEqual({
      ...TEST_PROPS,
      createdAt: now,
      updatedAt: now,
      id: timer.id
    })
  })

  describe.concurrent('Timer Domain Events', () => {
    const toBeCloser = ({
      value,
      compare,
      gap = 3
    }: {
      value: number
      compare: number
      gap?: number
    }): void => {
      expect(value).toBeGreaterThanOrEqual(compare)
      expect(value).toBeLessThanOrEqual(compare + gap)
    }
    it.concurrent('On create Timer', async () => {
      const timer = Timer.create({
        userId: TEST_ID
      })
      const events = timer.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TimerCreateEvent
      expect(e.aggregateId).toBe(timer.id)
      expect(e.userId).toBe(TEST_ID)
    })
    it.concurrent('On start Timer', async () => {
      const now = Date.now()
      const timer = new Timer({
        id: TEST_ID,
        props: { ...TEST_PROPS }
      })
      timer.start()
      expect(timer.getProps().status.isRunning()).toBe(true)
      toBeCloser({ value: timer.getProps().startedAt, compare: now })
      expect(timer.getProps().stoppedAt).toBe(0)

      const events = timer.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TimerStartEvent
      expect(e).toBeInstanceOf(TimerStartEvent)
      expect(e.aggregateId).toBe(timer.id)
      expect(e.userId).toBe(TEST_ID)
      expect(e.duration).toBe(timer.currentDuration)

      toBeCloser({ value: e.startedAt, compare: now })
    })
    it.concurrent('On stop Timer', async () => {
      const now = Date.now()
      const timer = new Timer({
        id: TEST_ID,
        props: {
          ...TEST_PROPS,
          status: new Status(StatusEnum.RUNNING),
          startedAt: now
        }
      })
      timer.stop()
      expect(timer.getProps().status.isPaused()).toBe(true)
      toBeCloser({ value: timer.getProps().stoppedAt, compare: now })

      const events = timer.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TimerStopEvent
      expect(e).toBeInstanceOf(TimerStopEvent)
      expect(e.aggregateId).toBe(timer.id)
      expect(e.userId).toBe(TEST_ID)
      expect(e.stage).toBe(StageEnum.POMODORO)

      toBeCloser({ value: e.stoppedAt, compare: now })
    })
    it.concurrent('On resume Timer', async () => {
      const now = Date.now()
      const timer = new Timer({
        id: TEST_ID,
        props: {
          ...TEST_PROPS,
          status: new Status(StatusEnum.PAUSED),
          startedAt: now - 10000,
          stoppedAt: now
        }
      })
      timer.resume()
      expect(timer.getProps().status.isRunning()).toBe(true)
      toBeCloser({ value: timer.getProps().startedAt, compare: now })

      const events = timer.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TimerResumeEvent
      expect(e).toBeInstanceOf(TimerResumeEvent)
      expect(e.aggregateId).toBe(timer.id)
      expect(e.userId).toBe(TEST_ID)
      toBeCloser({ value: e.duration, compare: timer.currentDuration, gap: 5 })
      toBeCloser({ value: e.startedAt, compare: now })
    })
    it.concurrent('On finish Timer', async () => {
      const now = Date.now()
      const timer = new Timer({
        id: TEST_ID,
        props: {
          ...TEST_PROPS,
          status: new Status(StatusEnum.RUNNING),
          startedAt: now
        }
      })
      timer.finish()
      expect(timer.getProps().status.isReady()).toBe(true)
      expect(timer.getProps().startedAt).toBe(0)
      expect(timer.getProps().stoppedAt).toBe(0)
      expect(timer.getProps().pomodoroCounter).toBe(1)
      expect(timer.getProps().stage.currentStage).toBe(StageEnum.SHORT_BREAK)

      const events = timer.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TimerFinishEvent
      expect(e).toBeInstanceOf(TimerFinishEvent)
      expect(e.aggregateId).toBe(timer.id)
      expect(e.userId).toBe(TEST_ID)
      expect(e.currentTaskId).toBeNull()
      expect(e.pomodoroCounter).toBe(1)
      expect(e.prevStage).toBe(StageEnum.POMODORO)
      expect(e.nextStage).toBe(StageEnum.SHORT_BREAK)
    })
    it.concurrent('On change stage Timer to Pomodoro', async () => {
      const now = new Date()
      const timer = new Timer({
        id: TEST_ID,
        props: {
          ...TEST_PROPS,
          stage: new Stage({
            stageInterval: 4,
            currentStage: StageEnum.SHORT_BREAK
          })
        },
        createdAt: now,
        updatedAt: now
      })
      timer.changeToPomodoroStage()
      expect(timer.getProps()).toEqual({
        ...TEST_PROPS,
        id: TEST_ID,
        createdAt: now,
        updatedAt: now
      })

      const events = timer.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TimerChangeStageEvent
      expect(e).toBeInstanceOf(TimerChangeStageEvent)
      expect(e.aggregateId).toBe(timer.id)
      expect(e.userId).toBe(TEST_ID)
      expect(e.oldStage).toBe(StageEnum.SHORT_BREAK)
      expect(e.newStage).toBe(StageEnum.POMODORO)
    })
    it.concurrent('On change stage Timer to Short Break', async () => {
      const now = new Date()
      const timer = new Timer({
        id: TEST_ID,
        props: {
          ...TEST_PROPS
        },
        createdAt: now,
        updatedAt: now
      })
      timer.changeToShortBreakStage()
      expect(timer.getProps()).toEqual({
        ...TEST_PROPS,
        stage: new Stage({
          stageInterval: 4,
          currentStage: StageEnum.SHORT_BREAK
        }),
        id: TEST_ID,
        createdAt: now,
        updatedAt: now
      })

      const events = timer.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TimerChangeStageEvent
      expect(e).toBeInstanceOf(TimerChangeStageEvent)
      expect(e.aggregateId).toBe(timer.id)
      expect(e.userId).toBe(TEST_ID)
      expect(e.oldStage).toBe(StageEnum.POMODORO)
      expect(e.newStage).toBe(StageEnum.SHORT_BREAK)
    })
    it.concurrent('On change stage Timer to Long Break', async () => {
      const now = new Date()
      const timer = new Timer({
        id: TEST_ID,
        props: {
          ...TEST_PROPS
        },
        createdAt: now,
        updatedAt: now
      })
      timer.changeToLongBreakStage()
      expect(timer.getProps()).toEqual({
        ...TEST_PROPS,
        stage: new Stage({
          stageInterval: 4,
          currentStage: StageEnum.LONG_BREAK
        }),
        id: TEST_ID,
        createdAt: now,
        updatedAt: now
      })

      const events = timer.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TimerChangeStageEvent
      expect(e).toBeInstanceOf(TimerChangeStageEvent)
      expect(e.aggregateId).toBe(timer.id)
      expect(e.userId).toBe(TEST_ID)
      expect(e.oldStage).toBe(StageEnum.POMODORO)
      expect(e.newStage).toBe(StageEnum.LONG_BREAK)
    })
  })
  describe.concurrent('Timer Exceptions', () => {
    it.concurrent('Should throw and error if userId is not provided', async () => {
      try {
        // @ts-expect-error Testing for exception
        Timer.create({})
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(TimerFieldRequired)
        expect((error as Error).message).toBe('userId is required')
      }
    })
    it.concurrent('Should throw and error if startedAt is not provided', async () => {
      try {
        // eslint-disable-next-line no-new
        new Timer({
          id: TEST_ID,
          props: {
            ...TEST_PROPS,
            // @ts-expect-error Testing for exception
            startedAt: undefined
          }
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(TimerFieldRequired)
        expect((error as Error).message).toBe('startedAt is required')
      }
    })

    it.concurrent('Should throw and error if stoppedAt is not provided', async () => {
      try {
        // eslint-disable-next-line no-new
        new Timer({
          id: TEST_ID,
          props: {
            ...TEST_PROPS,
            // @ts-expect-error Testing for exception
            stoppedAt: undefined
          }
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(TimerFieldRequired)
        expect((error as Error).message).toBe('stoppedAt is required')
      }
    })

    it.concurrent('Should throw and error if pomodoroCounter is not provided', async () => {
      try {
        // eslint-disable-next-line no-new
        new Timer({
          id: TEST_ID,
          props: {
            ...TEST_PROPS,
            // @ts-expect-error Testing for exception
            pomodoroCounter: undefined
          }
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(TimerFieldRequired)
        expect((error as Error).message).toBe('pomodoroCounter is required')
      }
    })
    it.concurrent('Should throw and error if status is not a instance of Status VO', async () => {
      try {
        // eslint-disable-next-line no-new
        new Timer({
          id: TEST_ID,
          props: {
            ...TEST_PROPS,
            // @ts-expect-error Testing for exception
            status: {}
          }
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as Error).message).toBe('status must be a Status instance')
      }
    })

    it.concurrent('Should throw and error if stage is not a instance of Stage VO', async () => {
      try {
        // eslint-disable-next-line no-new
        new Timer({
          id: TEST_ID,
          props: {
            ...TEST_PROPS,
            // @ts-expect-error Testing for exception
            stage: {}
          }
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as Error).message).toBe('stage must be a Stage instance')
      }
    })
    it.concurrent(
      'Should throw and error if duration is not a instance of Duration VO',
      async () => {
        try {
          // eslint-disable-next-line no-new
          new Timer({
            id: TEST_ID,
            props: {
              ...TEST_PROPS,
              // @ts-expect-error Testing for exception
              duration: {}
            }
          })
          expect(true).toBe(false)
        } catch (error) {
          expect(error).toBeInstanceOf(ValidationError)
          expect((error as Error).message).toBe('duration must be a Duration instance')
        }
      }
    )
    it.concurrent(
      'Should throw an error when trying to start a timer that is not ready',
      async () => {
        const timer = new Timer({
          id: TEST_ID,
          props: {
            ...TEST_PROPS,
            status: new Status(StatusEnum.RUNNING)
          }
        })
        try {
          timer.start()
          expect(true).toBe(false)
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidCurrentStage)
          expect((error as Error).message).toBe('Timer is not ready to start.')
        }
      }
    )

    it.concurrent(
      'Should throw an error when trying to stop a timer that is not running',
      async () => {
        const timer = new Timer({
          id: TEST_ID,
          props: {
            ...TEST_PROPS,
            status: new Status(StatusEnum.PAUSED)
          }
        })
        try {
          timer.stop()
          expect(true).toBe(false)
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidCurrentStage)
          expect((error as Error).message).toBe('Timer is not running.')
        }
      }
    )

    it.concurrent(
      'Should throw an error when trying to resume a timer that is not paused',
      async () => {
        const timer = new Timer({
          id: TEST_ID,
          props: {
            ...TEST_PROPS,
            status: new Status(StatusEnum.READY)
          }
        })
        try {
          timer.resume()
          expect(true).toBe(false)
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidCurrentStage)
          expect((error as Error).message).toBe('Timer is not paused.')
        }
      }
    )

    it.concurrent(
      'Should throw an error when trying to finish a timer that is not running',
      async () => {
        const timer = new Timer({
          id: TEST_ID,
          props: { ...TEST_PROPS }
        })
        try {
          timer.finish()
          expect(true).toBe(false)
        } catch (error) {
          expect(error).toBeInstanceOf(InvalidCurrentStage)
          expect((error as Error).message).toBe('Timer is not running.')
        }
      }
    )
    it.concurrent('Should throw an error when trying to change to Pomodoro stage', async () => {
      const timer = new Timer({
        id: TEST_ID,
        props: {
          ...TEST_PROPS
        }
      })
      try {
        timer.changeToPomodoroStage()
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidCurrentStage)
        expect((error as Error).message).toBe('Timer is already in Pomodoro stage')
      }
    })
    it.concurrent('Should throw an error when trying to change to Short Break stage', async () => {
      const timer = new Timer({
        id: TEST_ID,
        props: {
          ...TEST_PROPS,
          stage: new Stage({
            stageInterval: 4,
            currentStage: StageEnum.SHORT_BREAK
          })
        }
      })
      try {
        timer.changeToShortBreakStage()
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidCurrentStage)
        expect((error as Error).message).toBe('Timer is already in Short Break stage')
      }
    })
    it.concurrent('Should throw an error when trying to change to Long Break stage', async () => {
      const timer = new Timer({
        id: TEST_ID,
        props: {
          ...TEST_PROPS,
          stage: new Stage({
            stageInterval: 4,
            currentStage: StageEnum.LONG_BREAK
          })
        }
      })
      try {
        timer.changeToLongBreakStage()
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidCurrentStage)
        expect((error as Error).message).toBe('Timer is already in Long Break stage')
      }
    })
  })
})
