interface UserCreateInput {
  id?: string
  name: string
  email: string
  password_hash: string
  created_at?: Date | string
}

export class InMemoryUsersRepository {
  private users: UserCreateInput[] = []

  create(data: UserCreateInput) {
    const user = this.users.push(data)

    return user
  }

  read() {
    return this.users
  }
}
