import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TaskRequestDTO } from './tasks.dto'

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
      },
    })
  }

  async findById(projectId: string, taskId: string) {
    return this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    })
  }

  async create(projectId: string, data: TaskRequestDTO) {
    return this.prisma.task.create({
      data: {
        ...data,
        projectId,
      },
    })
  }

  async update(projectId: string, taskId: string, data: TaskRequestDTO) {
    return this.prisma.task.update({
      where: {
        id: taskId,
        projectId,
      },
      data,
    })
  }

  async delete(projectId: string, taskId: string) {
    await this.prisma.task.deleteMany({
      where: {
        id: taskId,
        projectId,
      },
    })
  }
}
