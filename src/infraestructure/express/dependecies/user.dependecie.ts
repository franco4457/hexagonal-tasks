import { UserLogin, UserRegister } from '@/application'
import { InMemoryUserRepository } from '@/infraestructure/repsitory/mock'
import { LoginController, RegisterController, GetUserController } from '../controllers/user'

const inMemoryUserRepository = new InMemoryUserRepository()

export const userLogin = new UserLogin(inMemoryUserRepository)
export const userRegister = new UserRegister(inMemoryUserRepository)

export const loginController = new LoginController(userLogin)
export const registerController = new RegisterController(userRegister)

export const getUserController = new GetUserController(inMemoryUserRepository)
