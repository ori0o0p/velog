import { container } from 'tsyringe'
import { FollowService } from './index.js'

describe('FollowService', () => {
  const service = container.resolve(FollowService)
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
