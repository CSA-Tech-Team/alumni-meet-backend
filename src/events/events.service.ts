import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityDto, UpdateActivityDto } from './dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllActivities() {
    return this.prisma.activity.findMany({
      include: { userActivities: true },
    });
  }

  async getActivityById(id: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: { userActivities: true },
    });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    return activity;
  }

  async createActivity(dto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: {
        eventName: dto.eventName,
        about: dto.about,
      },
    });
  }

  async updateActivity(id: string, dto: UpdateActivityDto) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    return this.prisma.activity.update({
      where: { id },
      data: {
        eventName: dto.eventName,
        about: dto.about,
      },
    });
  }

  async deleteActivity(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    return this.prisma.activity.delete({
      where: { id },
    });
  }

  async joinActivity(email: string, eventId: string) {
    // Find the user's profile using the unique email
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    // Validate that the activity exists
    const activity = await this.prisma.activity.findUnique({ where: { id: eventId } });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check if the user has already joined the activity
    const alreadyJoined = await this.prisma.userActivity.findFirst({
      where: { userId: profile.userId, eventId },
    });
    if (alreadyJoined) {
      throw new HttpException('User already joined the activity', HttpStatus.BAD_REQUEST);
    }

    // Create the participation record
    return this.prisma.userActivity.create({
      data: {
        userId: profile.userId,
        eventId,
      },
    });
  }

  async leaveActivity(email: string, eventId: string) {
    // Find the user's profile using the unique email
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    // Find the participation record
    const participation = await this.prisma.userActivity.findFirst({
      where: { userId: profile.userId, eventId },
    });
    if (!participation) {
      throw new NotFoundException('User is not participating in this activity');
    }
    return this.prisma.userActivity.delete({
      where: { id: participation.id },
    });
  }

  async getUserActivities(email: string) {
    // Find the user's profile using the unique email
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.userActivity.findMany({
      where: { userId: profile.userId },
      include: { event: true },
    });
  }

  async getUserSingings(email: string) {
    // Find the user's profile using the unique email
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.singing.findMany({
      where: { userId: profile.userId },
    });
  }

  async getUserGalleries(email: string) {
    // Find the user's profile using the unique email
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.gallery.findMany({
      where: { userId: profile.userId },
    });
  }
}
