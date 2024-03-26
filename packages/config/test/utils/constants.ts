import { InMemoryEventBus } from '@infrastructure/event-bus-in-memory'

export const TEST_ID = 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a'
export const REPO_CONFIG = {
  appContext: 'TEST',
  eventBus: new InMemoryEventBus()
}
export const MOCK_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyZDdlMGUwLTRlMGEtNGI3YS04YzdlLTJhOWE5YjBhM2IxYSIsImlhdCI6MTcwNzc4NTM0N30.F-sCWFjQ8DzpkRYjzlUPBgt70KfIR0ANwNuxKGw88DE'
