import { InMemoryTimerRepository } from '@/infraestructure/repository/in-memory'
import { REPO_CONFIG, TEST_ID } from './../utils/constants'
import { UserCreateEvent } from '@/domain/user'
import { TimerCreateOnCreateUserEventHandler } from '@/application/timer/handlers/timer-create-on-create-user.event-handler'
import {
  Duration,
  Stage,
  StageEnum,
  Status,
  StatusEnum,
  Timer,
  TimerFieldRequired
} from '@/domain/timer'
import {
  TimerFinishCommand,
  TimerFinishService,
  TimerResumeCommand,
  TimerResumeService,
  TimerStarService,
  TimerStartCommand,
  TimerStopCommand,
  TimerStopService
} from '@/application/timer'

const TIMER_BASE = {
  userId: TEST_ID,
  startedAt: 0,
  stoppedAt: 0,
  pomodoroCounter: 0,
  stage: Stage.create({}),
  status: Status.create(),
  currentTaskId: null,
  duration: Duration.create({})
}

describe.concurrent('Timer', async () => {
  let timerRepository: InMemoryTimerRepository = new InMemoryTimerRepository(REPO_CONFIG)
  let now = Date.now()
  afterEach(async () => {
    timerRepository = new InMemoryTimerRepository(REPO_CONFIG)
    now = Date.now()
  })
  it.concurrent('create timer on create user', async () => {
    const userCreateEvent = new UserCreateEvent({
      aggregateId: TEST_ID,
      email: 'test@mail.com',
      username: 'test-user'
    })
    const eventHandler = new TimerCreateOnCreateUserEventHandler({ timerRepository })
    await eventHandler.handle(userCreateEvent)
    const timer = await timerRepository.getTimerByUserId(TEST_ID)
    expect(timer).toBeInstanceOf(Timer)
    expect(timer.getProps()).toEqual({
      ...TIMER_BASE,
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it.concurrent('start timer', async () => {
    await timerRepository.create(new Timer({ id: TEST_ID, props: { ...TIMER_BASE } }))
    const startTimer = new TimerStarService(timerRepository)
    await startTimer.execute(new TimerStartCommand({ userId: TEST_ID }))
    const timer = await timerRepository.getTimer(TEST_ID)
    const props = timer.getProps()
    expect(props.startedAt).toBeGreaterThanOrEqual(now)
    expect(props.stoppedAt).toBe(0)
    expect(props.pomodoroCounter).toBe(0)
    expect(props.stage.currentStage).toBe(StageEnum.POMODORO)

    expect(props.status).toBeInstanceOf(Status)
    expect(props.status.isRunning()).toBe(true)
    expect(props.currentTaskId).toBeNull()
  })
  it.concurrent('stop timer', async () => {
    const newTimer = new Timer({ id: TEST_ID, props: { ...TIMER_BASE } })
    newTimer.start()
    await timerRepository.create(newTimer)
    const timer = await timerRepository.getTimer(TEST_ID)
    expect(timer.getProps().status.isRunning()).toBe(true)
    expect(timer.getProps().startedAt).toBeGreaterThanOrEqual(now)

    const stopTimer = new TimerStopService(timerRepository)
    await stopTimer.execute(new TimerStopCommand({ userId: TEST_ID }))
    const stoppedTimer = await timerRepository.getTimer(TEST_ID)
    const stoppedProps = stoppedTimer.getProps()
    expect(stoppedProps.startedAt).toBeGreaterThanOrEqual(now)
    expect(stoppedProps.stoppedAt).toBeGreaterThanOrEqual(stoppedProps.startedAt)
    expect(stoppedProps.pomodoroCounter).toBe(0)
    expect(stoppedProps.stage.currentStage).toBe(StageEnum.POMODORO)
    expect(stoppedProps.status).toBeInstanceOf(Status)
    expect(stoppedProps.status.isPaused()).toBe(true)
  })
  it.concurrent('resume timer', async () => {
    await timerRepository.create(
      new Timer({
        id: TEST_ID,
        props: {
          ...TIMER_BASE,
          startedAt: now - 1000,
          stoppedAt: now,
          status: new Status(StatusEnum.PAUSED),
          stage: Stage.create({ currentStage: StageEnum.POMODORO })
        }
      })
    )
    const timer = await timerRepository.getTimer(TEST_ID)
    expect(timer.getProps().status.isPaused()).toBe(true)

    const startTimer = new TimerResumeService(timerRepository)
    await startTimer.execute(new TimerResumeCommand({ userId: TEST_ID }))
    const resumedTimer = await timerRepository.getTimer(TEST_ID)
    const resumedProps = resumedTimer.getProps()
    expect(resumedProps.startedAt).toBeGreaterThanOrEqual(now)
    expect(resumedProps.stoppedAt).toBeLessThanOrEqual(resumedProps.startedAt)

    expect(resumedProps.pomodoroCounter).toBe(0)
    expect(resumedProps.stage.currentStage).toBe(StageEnum.POMODORO)
    expect(resumedProps.status).toBeInstanceOf(Status)
    expect(resumedProps.status.isRunning()).toBe(true)
  })
  it.concurrent('finish timer', async () => {
    const newTimer = new Timer({ id: TEST_ID, props: { ...TIMER_BASE } })
    newTimer.start()
    await timerRepository.create(newTimer)
    const timer = await timerRepository.getTimer(TEST_ID)
    expect(timer.getProps().status.isRunning()).toBe(true)

    const finishTimer = new TimerFinishService(timerRepository)
    await finishTimer.execute(new TimerFinishCommand({ userId: TEST_ID }))
    const finishedTimer = await timerRepository.getTimer(TEST_ID)
    const finishedProps = finishedTimer.getProps()
    expect(finishedProps.startedAt).toBe(0)
    expect(finishedProps.stoppedAt).toBe(0)
    expect(finishedProps.pomodoroCounter).toBe(1)
    expect(finishedProps.stage.currentStage).toBe(StageEnum.SHORT_BREAK)
    expect(finishedProps.status).toBeInstanceOf(Status)
    expect(finishedProps.status.isReady()).toBe(true)
  })
  it.concurrent('finish timer with long break', async () => {
    const newTimer = new Timer({ id: TEST_ID, props: { ...TIMER_BASE, pomodoroCounter: 3 } })
    newTimer.start()
    await timerRepository.create(newTimer)
    const timer = await timerRepository.getTimer(TEST_ID)
    expect(timer.getProps().status.isRunning()).toBe(true)

    const finishTimer = new TimerFinishService(timerRepository)
    await finishTimer.execute(new TimerFinishCommand({ userId: TEST_ID }))
    const finishedTimer = await timerRepository.getTimer(TEST_ID)
    const finishedProps = finishedTimer.getProps()
    expect(finishedProps.startedAt).toBe(0)
    expect(finishedProps.stoppedAt).toBe(0)
    expect(finishedProps.pomodoroCounter).toBe(4)
    expect(finishedProps.stage.currentStage).toBe(StageEnum.LONG_BREAK)
    expect(finishedProps.status).toBeInstanceOf(Status)
    expect(finishedProps.status.isReady()).toBe(true)
  })
  describe.concurrent('Exceptions', async () => {
    it.concurrent('should throw an error if event dont have userId', async () => {
      const eventHandler = new TimerCreateOnCreateUserEventHandler({ timerRepository })
      try {
        await eventHandler.handle(
          new UserCreateEvent({
            // @ts-expect-error Testing purposes
            aggregateId: undefined
          })
        )
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(TimerFieldRequired)
        expect((e as Error).message).toBe('userId is required')
      }
    })
  })
})
