import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const DEFAULT_FAKE_LATITUDE = -27.2092052
const DEFAULT_FAKE_LONGITUDE = -49.6401091

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(DEFAULT_FAKE_LATITUDE),
      longitude: new Decimal(DEFAULT_FAKE_LONGITUDE),
    })

    // it is a very useful method to handle system date to use fake dates
    vi.useFakeTimers()
  })

  afterEach(() => {
    // here we set dates back to real time
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: DEFAULT_FAKE_LATITUDE,
      userLongitude: DEFAULT_FAKE_LONGITUDE,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    // in sequence with allowing to use fake dates we can set system date to a specific date
    // very useful for when we need to test rules dependent on dates
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: DEFAULT_FAKE_LATITUDE,
      userLongitude: DEFAULT_FAKE_LONGITUDE,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: DEFAULT_FAKE_LATITUDE,
        userLongitude: DEFAULT_FAKE_LONGITUDE,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: DEFAULT_FAKE_LONGITUDE,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: DEFAULT_FAKE_LONGITUDE,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Clean Architecture Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.4333178),
      longitude: new Decimal(-48.4052835),
    })

    await expect(
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: DEFAULT_FAKE_LATITUDE,
        userLongitude: DEFAULT_FAKE_LONGITUDE,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
