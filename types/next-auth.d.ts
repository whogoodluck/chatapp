import { User } from './user.type'

declare module 'next-auth' {
  type UserData = User

  type Session = {
    user: UserData
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idIoken?: string
    provider?: string
    accessToken?: string
  }
}

interface JSONData {
  user: User
  expires: string
}
