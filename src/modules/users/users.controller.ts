import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { CreateUserDTO, UpdateUserDTO, UserFullDTO, UserListItemDTO } from './users.dto'
import { UsersService } from './users.service'

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ type: [UserListItemDTO] })
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':userId')
  @ApiResponse({ type: UserFullDTO })
  async findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    const user = await this.usersService.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserDTO) {
    return this.usersService.create(data)
  }

  @Put(':userId')
  async update(@Param('userId', ParseUUIDPipe) userId: string, @Body() data: UpdateUserDTO) {
    return this.usersService.update(userId, data)
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.remove(userId)
  }
}
