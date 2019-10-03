import { Test, TestingModule } from '@nestjs/testing'
import { DefaultResolver } from './default.resolver'

describe('DefaultResolver', () => {
  let resolver: DefaultResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefaultResolver]
    }).compile()

    resolver = module.get<DefaultResolver>(DefaultResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
