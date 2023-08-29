import { UserLogin, UserRegister } from '@/user/application'
import { InMemoryUserRepository } from '@/user/infraestructure/mock'
import { LoginController } from '../controllers/user/login.controller'
import { RegisterController } from '../controllers/user/register.controller'
import { GetUserController } from '../controllers/user/get-user.controller'

const inMemoryUserRepository = new InMemoryUserRepository()

export const userLogin = new UserLogin(inMemoryUserRepository)
export const userRegister = new UserRegister(inMemoryUserRepository)

export const loginController = new LoginController(userLogin)
export const registerController = new RegisterController(userRegister)

export const getUserController = new GetUserController(inMemoryUserRepository)
