import type { User, UserCredential } from "firebase/auth"

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<UserCredential>
  register: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>
  logout: () => Promise<void>
  googleLogin: () => Promise<void>
}