import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityDto, GetActivityDetailsDTO, postAGallertPicDTO, UpdateActivityDto } from './dto';
import { Events } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) { }

  async getUsersByCourse() {
    const usersByCourse = await this.prisma.profile.groupBy({
      by: ['course'],
      _count: {
        course: true,
      },
      where: {
        course: {
          not: null,
        },
      },
    });

    return usersByCourse.map((item) => ({
      course: item.course,
      count: item._count.course,
    }));
  }
  
  async getAllActivities() {
    return this.prisma.activity.findMany({
      include: {
        userActivities: {
          include: {
            user: {
              select: {
                email: true,
                profile: {
                  select: {
                    name: true,
                    phoneNumber: true,
                    rollNumber: true,
                    email: true
                  },
                },

              }
            },
          },
        },
      },
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
    if (!(dto.eventName in Events)) {
      throw new HttpException('Event name not found in enum', HttpStatus.BAD_REQUEST);
    }
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
    if (dto.eventName !== undefined && !(dto.eventName in Events)) {
      throw new HttpException('Event name not found in enum', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.activity.update({
      where: { id },
      data: {
        eventName: dto.eventName,
        about: dto.about,
      },
    });
  }

  async getAllEvents() {
    return this.prisma.activityDetails.findMany({
      include: {
        user: true
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
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    const activity = await this.prisma.activity.findUnique({ where: { id: eventId } });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const alreadyJoined = await this.prisma.userActivity.findFirst({
      where: { userId: profile.userId, eventId },
    });
    if (alreadyJoined) {
      throw new HttpException('User already joined the activity', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.userActivity.create({
      data: {
        userId: profile.userId,
        eventId,
      },
    });
  }

  async leaveActivity(email: string, eventId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

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
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    const joinedActivities = await this.prisma.userActivity.findMany({
      where: { userId: profile.userId },
      include: {
        event: true, user: {
          select: {
            id: true,
            profile: {
              select: {
                name: true,
                phoneNumber: true,
                rollNumber: true,
                email: true
              }
            }
          }
        }
      },
    });

    const addedActivities = await this.prisma.activityDetails.findMany({
      where: { userId: profile.userId },
    });

    return {
      joinedActivities,
      addedActivities,
    };
  }

  async getUserSingings(email: string) {
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.activityDetails.findMany({
      where: { userId: profile.userId },
      include: {
        user: true,
      },
    });
  }

  async getConsolidatedEventCount() {
    const groupCounts = await this.prisma.activityDetails.groupBy({
      by: ['event'],
      _count: { id: true },
    });

    const consolidatedCounts: Record<Events, number> = {} as Record<Events, number>;

    Object.values(Events).forEach((event: Events) => {
      const found = groupCounts.find((entry) => entry.event === event);
      consolidatedCounts[event] = found?._count.id ?? 0;
    });

    return consolidatedCounts;
  }

  async getActivityDetails(email: string, activityData: GetActivityDetailsDTO) {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
      select: { userId: true }
    });

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    const newActivity = await this.prisma.activityDetails.create({
      data: {
        event: activityData.event,
        songDetails: activityData.songDetails,
        topic: activityData.topic,
        needKaroke: activityData.needKaroke ?? false,
        user: {
          connect: { id: profile.userId }
        }
      }
    });

    return newActivity;
  }

  async postAGallertPic(email: string, dto: postAGallertPicDTO) {
    const usr = await this.prisma.user.findUnique({ where: { email } });
    if (!usr) {
      throw new NotFoundException('User not found');
    }

    const gallery = await this.prisma.gallery.create({
      data: {
        assetUrl: dto.imageUrl,
        user: {
          connect: {
            id: usr.id
          }
        }
      }
    })

    return { gallery }

  }

  async getGalleryImagesWithUserName() {
    const galleries = await this.prisma.gallery.findMany({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return galleries.map((gallery) => ({
      assetUrl: gallery.assetUrl,
      postedBy: gallery.user.profile ? gallery.user.profile.name : 'Unknown',
    }));
  }

  async getUserGalleries(email: string) {
    const profile = await this.prisma.profile.findUnique({ where: { email } });
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.gallery.findMany({
      where: { userId: profile.userId },
    });
  }
}