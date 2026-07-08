import { Injectable, NotFoundException } from '@nestjs/common'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { PrismaService } from 'src/prisma.service'
import { CommentsRequestDTO } from './comments.dto'

const authorAttributes = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  },
}

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  findAllByTask(taskId: string) {
    return this.prisma.comment.findMany({
      where: {
        taskId,
      },
      include: authorAttributes,
    })
  }

  findById(taskId: string, commentId: string) {
    return this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            projectId: true,
          },
        },
      },
    })
  }

  create(taskId: string, data: CommentsRequestDTO) {
    const userId = this.requestContext.getUserId()
    return this.prisma.comment.create({
      data: {
        taskId,
        authorId: userId,
        content: data.content,
      },
      include: authorAttributes,
    })
  }

  async update(taskId: string, commentId: string, data: CommentsRequestDTO) {
    const userId = this.requestContext.getUserId()

    const existingComment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        authorId: userId,
      },
    })

    if (!existingComment) {
      throw new NotFoundException('Comment not found')
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data,
      include: authorAttributes,
    })
  }

  async remove(taskId: string, commentId: string) {
    const userId = this.requestContext.getUserId()

    const existingComment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        authorId: userId,
      },
    })

    if (!existingComment) {
      throw new NotFoundException('Comment not found')
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    })
  }
}
