import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthModule } from './auth.module';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { mockedUsers } from '../users/users.mocks';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
    .overrideProvider(AuthService)
    .useValue(service)
    .overrideProvider(PrismaService)
    .useValue({ $connect: jest.fn() })
    .overrideProvider(JwtService)
    .useValue({
      sign: jest.fn().mockReturnValue('123'),
      verify: jest.fn(),
    })
    .overrideProvider(UsersService)
    .useValue(userService)
    .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  describe('signUp', () => {
    it('should be able to sign up a new user', async () => {
      const user = mockedUsers[0]
      const mockedResponse = {
        token: '123'
      }

      jest.spyOn(service, 'signup').mockResolvedValue(mockedResponse)

      const  response = await controller.signup(user)

      expect(response).toEqual(mockedResponse)
      expect(service.signup).toHaveBeenCalledTimes(1)
    })

    it('should be able to handle validation errors', async () => {
      const error = new Error('E-mail is required')

      jest.spyOn(service, 'signup').mockRejectedValue(error)

      await expect(controller.signup({ email: '', name: '', password: '' })).rejects.toThrow(error)
    })
  })

  describe('signIn', () => {
    it('should be able to sign in with the correct credentials', async () => {
      const user = mockedUsers[0]
      const mockedResponse = {
        token: '123'
      }

      jest.spyOn(service, 'signin').mockResolvedValue(mockedResponse)

      const response = await controller.signin(user)

      expect(response).toEqual(mockedResponse)
      expect(service.signin).toHaveBeenCalledTimes(1)
    })

    it('should be able to handle validation errors', async () => {
      const error = new Error('E-mail is required')

      jest.spyOn(service, 'signin').mockRejectedValue(error)

      await expect(controller.signin({ email: '', password: '' })).rejects.toThrow(error)
    })
  })

  describe('forgotPassword', () => {
    it('should be able to request the e-mail to reset the password', async () => {
      const user = mockedUsers[0]
      const mockedResponse = {
        message: 'Password request email sent'
      }

      jest.spyOn(service, 'forgotPassword').mockResolvedValue(mockedResponse)

      const response = await controller.forgotPassword(user)

      expect(response).toEqual(mockedResponse)
      expect(service.forgotPassword).toHaveBeenCalledTimes(1)
    })

    it('should be able to handle validation errors', async () => {
      const error = new Error('E-mail is required')

      jest.spyOn(service, 'forgotPassword').mockRejectedValue(error)

      await expect(controller.forgotPassword({ email: '' })).rejects.toThrow(error)
    })
  })

  describe('resetPassword', () => {
    it('should be able to reset the password form e-mail link', async () => {
      const user = mockedUsers[0]

      jest.spyOn(service, 'resetPassword').mockResolvedValue(user)

      const response = await controller.resetPassword({
        newPassword: '123',
        token: '123'
      })

      expect(response).toEqual(user)
      expect(service.resetPassword).toHaveBeenCalledTimes(1)
    })

    it('should be able to handle validation errors', async () => {
      const error = new Error('Token is required')

      jest.spyOn(service, 'resetPassword').mockRejectedValue(error)

      await expect(controller.resetPassword({ newPassword: '', token: '' })).rejects.toThrow(error)
    })
  })
});
