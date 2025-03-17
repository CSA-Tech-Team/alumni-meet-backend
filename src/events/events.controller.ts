import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy';
import { EventService } from './events.service';
import { UserDecorator } from 'src/decorator'; 
import { CreateActivityDto, UpdateActivityDto } from './dto/index';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
    constructor(private readonly eventService: EventService) { }

    @Get()
    async getAllActivities() {
        return await this.eventService.getAllActivities();
    }

    @Get(':id')
    async getActivityById(@Param('id') id: string) {
        return await this.eventService.getActivityById(id);
    }

    @Post()
    async createActivity(
        @Body() dto: CreateActivityDto,
    ) {
        return await this.eventService.createActivity(dto);
    }

    @Put(':id')
    async updateActivity(
        @Param('id') id: string,
        @Body() dto: UpdateActivityDto,
        @UserDecorator() user
    ) {
        return await this.eventService.updateActivity(id, dto);
    }

    @Delete(':id')
    async deleteActivity(
        @Param('id') id: string,
        @UserDecorator() user
    ) {
        return await this.eventService.deleteActivity(id);
    }

    @Post(':id/join')
    async joinActivity(
        @Param('id') eventId: string,
        @UserDecorator() user
    ) {
        return await this.eventService.joinActivity(user.email, eventId);
    }

    @Delete(':id/leave')
    async leaveActivity(
        @Param('id') eventId: string,
        @UserDecorator() user
    ) {
        return await this.eventService.leaveActivity(user.email, eventId);
    }

    @Get('user/activities')
    async getUserActivities(@UserDecorator() user) {
        return await this.eventService.getUserActivities(user.email);
    }

    @Get('user/singings')
    async getUserSingings(@UserDecorator() user) {
        return await this.eventService.getUserSingings(user.email);
    }

    @Get('user/galleries')
    async getUserGalleries(@UserDecorator() user) {
        return await this.eventService.getUserGalleries(user.email);
    }
}
