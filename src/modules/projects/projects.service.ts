import { Injectable } from '@nestjs/common'
import { CollaboratorRole } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { ProjectsRequestDTO } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany()
  }

  findById(id: string) {
    return this.prisma.project.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
  }

  async create(data: ProjectsRequestDTO) {
    const project = await this.prisma.project.create({
      data: {
        ...data,
        createdById: '1e8c2036-a821-407a-befc-9c42c5299709', // TODO - Remover quando tiver autenticação
      },
    })

    // add the user as owner to the created project
    await this.prisma.projectCollaborator.create({
      data: {
        projectId: project.id,
        userId: '1e8c2036-a821-407a-befc-9c42c5299709', // TODO - Remover quando tiver autenticação
        role: CollaboratorRole.OWNER,
      },
    })

    return project
  }

  update(id: string, data: ProjectsRequestDTO) {
    return this.prisma.project.update({
      where: {
        id,
      },
      data,
    })
  }

  async remove(id: string) {
    await this.prisma.task.deleteMany({
      where: {
        projectId: id,
      },
    })

    return this.prisma.project.delete({
      where: {
        id,
      },
    })
  }
}
