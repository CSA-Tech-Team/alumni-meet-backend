import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy';
import { EventService } from './events.service';
import { UserDecorator } from 'src/decorator';
import { CreateActivityDto, GetActivityDetailsDTO, postAGallertPicDTO, UpdateActivityDto } from './dto/index';
import { User } from '@prisma/client';

@ApiTags('events')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
    constructor(private readonly eventService: EventService) { }

    // GET /events

    // GET /events/user/activities
    @UseGuards(JwtAuthGuard)
    @Get('user/activities')
    @ApiOperation({ summary: 'Retrieve all events that the user has joined. Pass access token as header.' })
    @ApiResponse({
        status: 200,
        description: 'List of events the user has joined',
        schema: {
            example: [
                {
                    "id": "1abe000e-5a9c-4b9f-9b3f-45e37166fe56",
                    "createdAt": "2025-03-20T05:45:59.678Z",
                    "updatedAt": "2025-03-20T05:45:59.678Z",
                    "eventName": "Singing",
                    "about": "This is a Singing Event where alumnis can interact with others by singing.",
                    "userActivities": [
                        {
                            "id": "cf677f8d-a972-4ca8-9f05-c5d6ba037788",
                            "createdAt": "2025-03-20T05:47:58.982Z",
                            "updatedAt": "2025-03-20T05:47:58.982Z",
                            "eventId": "1abe000e-5a9c-4b9f-9b3f-45e37166fe56",
                            "userId": "9f7375ef-fa76-447c-807f-bba07ff27692"
                        }
                    ]
                }
            ]
        }
    })
    async getUserActivities(@UserDecorator() user) {
        return await this.eventService.getUserActivities(user.email);
    }

    @Get("user/course")
    async getUsersByCourse() {
        return this.eventService.getUsersByCourse()
    }

    @Get("eventmemberscount")
    async getConsolidatedEventCount() {
        return this.eventService.getConsolidatedEventCount()
    }

    @Get("getGallery")
    async getGalleryItems() {
        return this.eventService.getGalleryImagesWithUserName()
    }

    @UseGuards(JwtAuthGuard)
    @Post("user/addgallerypic")
    async postAGalleryPic(@UserDecorator() usr: User, @Body() dto: postAGallertPicDTO) {
        return this.eventService.postAGallertPic(usr.email, dto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/singings')
    @ApiOperation({ summary: 'Retrieve all singing events associated with the user. Pass access token as header.' })
    @ApiResponse({
        status: 200,
        description: 'List of singing events',
        schema: {
            example: [
                {
                    "id": "1",
                    "title": "Singing Event",
                    "details": "Details about the singing event"
                }
            ]
        }
    })
    async getUserSingings(@UserDecorator() user) {
        return await this.eventService.getUserSingings(user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Post("user/getActivitydetails")
    async getActivityDetails(@UserDecorator() usr: User, @Body() dto: GetActivityDetailsDTO) {
        return this.eventService.getActivityDetails(usr.email, dto)
    }

    @Get('user/galleries')
    @ApiOperation({ summary: 'Retrieve all gallery events associated with the user. Pass access token as header.' })
    @ApiResponse({
        status: 200,
        description: 'List of gallery events',
        schema: {
            example: [
                {
                    "id": "1",
                    "title": "Gallery 1",
                    "images": ["img1.png", "img2.png"]
                }
            ]
        }
    })
    async getUserGalleries(@UserDecorator() user) {
        return await this.eventService.getUserGalleries(user.email);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all events with their user activities' })
    @ApiResponse({
        status: 200,
        description: 'List of events',
        schema: {
            example: [
                {
                    "id": "1abe000e-5a9c-4b9f-9b3f-45e37166fe56",
                    "createdAt": "2025-03-20T05:45:59.678Z",
                    "updatedAt": "2025-03-20T05:45:59.678Z",
                    "eventName": "Singing",
                    "about": "This is a Singing Event where alumnis can interact with others by singing.",
                    "userActivities": [
                        {
                            "id": "cf677f8d-a972-4ca8-9f05-c5d6ba037788",
                            "createdAt": "2025-03-20T05:47:58.982Z",
                            "updatedAt": "2025-03-20T05:47:58.982Z",
                            "eventId": "1abe000e-5a9c-4b9f-9b3f-45e37166fe56",
                            "userId": "9f7375ef-fa76-447c-807f-bba07ff27692"
                        }
                    ]
                },
                {
                    "id": "6bf5b780-0d97-4c43-a466-f00d5a4928ab",
                    "createdAt": "2025-03-20T05:46:34.219Z",
                    "updatedAt": "2025-03-20T05:46:34.219Z",
                    "eventName": "Dancing",
                    "about": "This is a Singing Event where alumnis can interact with others by singing.",
                    "userActivities": []
                },
                {
                    "id": "6f95765a-c33b-463f-a66d-a9f942ad11c3",
                    "createdAt": "2025-03-20T05:47:32.961Z",
                    "updatedAt": "2025-03-20T05:47:32.961Z",
                    "eventName": "Music",
                    "about": "This is a Singing Event where alumnis can interact with others by singing.",
                    "userActivities": []
                }
            ]
        }
    })
    async getAllActivities() {
        return await this.eventService.getAllActivities();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve an event by its ID' })
    @ApiParam({
        name: 'id',
        description: 'The unique identifier of the event',
    })
    @ApiResponse({
        status: 200,
        description: 'Event details',
        schema: {
            example: {
                "id": "1abe000e-5a9c-4b9f-9b3f-45e37166fe56",
                "createdAt": "2025-03-20T05:45:59.678Z",
                "updatedAt": "2025-03-20T05:45:59.678Z",
                "eventName": "Singing",
                "about": "This is a Singing Event where alumnis can interact with others by singing.",
                "userActivities": [
                    {
                        "id": "cf677f8d-a972-4ca8-9f05-c5d6ba037788",
                        "createdAt": "2025-03-20T05:47:58.982Z",
                        "updatedAt": "2025-03-20T05:47:58.982Z",
                        "eventId": "1abe000e-5a9c-4b9f-9b3f-45e37166fe56",
                        "userId": "9f7375ef-fa76-447c-807f-bba07ff27692"
                    }
                ]
            }
        }
    })
    async getActivityById(@Param('id') id: string) {
        return await this.eventService.getActivityById(id);
    }

    // POST /events
    @Post()
    @ApiOperation({ summary: 'Create a new event' })
    @ApiBody({
        description: 'Event creation object',
        type: "object",
        schema: {
            example: {
                "eventName": "New Activity",
                "about": "Description for new activity"
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'The event has been successfully created',
        schema: {
            example: {
                "id": "generated-event-id",
                "createdAt": "2025-03-20T05:50:00.000Z",
                "updatedAt": "2025-03-20T05:50:00.000Z",
                "eventName": "New Activity",
                "about": "Description for new activity",
                "userActivities": []
            }
        }
    })
    async createActivity(@Body() dto: CreateActivityDto) {
        return await this.eventService.createActivity(dto);
    }

    // PUT /events/:id
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing event' })
    @ApiParam({
        name: 'id',
        description: 'The unique identifier of the event to update',
    })
    @ApiBody({
        description: 'Event update object',
        type: "object",
        schema: {
            example: {
                "eventName": "Updated Activity",
                "about": "Updated description for activity"
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'The event has been successfully updated',
        schema: {
            example: {
                "id": "1abe000e-5a9c-4b9f-9b3f-45e37166fe56",
                "createdAt": "2025-03-20T05:45:59.678Z",
                "updatedAt": "2025-03-20T06:00:00.000Z",
                "eventName": "Updated Activity",
                "about": "Updated description for activity",
                "userActivities": []
            }
        }
    })
    async updateActivity(
        @Param('id') id: string,
        @Body() dto: UpdateActivityDto,
        @UserDecorator() user,
    ) {
        return await this.eventService.updateActivity(id, dto);
    }

    // DELETE /events/:id
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an event' })
    @ApiParam({
        name: 'id',
        description: 'The unique identifier of the event to delete',
    })
    @ApiResponse({
        status: 200,
        description: 'The event has been successfully deleted',
        schema: {
            example: {
                "message": "Activity deleted successfully"
            }
        }
    })
    async deleteActivity(
        @Param('id') id: string,
        @UserDecorator() user,
    ) {
        return await this.eventService.deleteActivity(id);
    }

    @Get("/allevents")
    async getAllUsers() {
        return this.eventService.getAllActivities()
    }
    // POST /events/:id/join
    @UseGuards(JwtAuthGuard)
    @Post(':id/join')
    @ApiOperation({ summary: 'Join an event using the provided event ID. Pass access token as header.' })
    @ApiParam({
        name: 'id',
        description: 'The unique identifier of the event to join',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully joined the event',
        schema: {
            example: {
                "id": "cf677f8d-a972-4ca8-9f05-c5d6ba037788",
                "createdAt": "2025-03-20T05:47:58.982Z",
                "updatedAt": "2025-03-20T05:47:58.982Z",
                "eventId": "1abe000e-5a9c-4b9f-9b3f-45e37166fe56",
                "userId": "9f7375ef-fa76-447c-807f-bba07ff27692"
            }
        }
    })
    async joinActivity(
        @Param('id') eventId: string,
        @UserDecorator() user,
    ) {
        return await this.eventService.joinActivity(user.email, eventId);
    }

    @Delete(':id/leave')
    @ApiOperation({ summary: 'Leave an event using the provided event ID. Pass access token as header.' })
    @ApiParam({
        name: 'id',
        description: 'The unique identifier of the event to leave',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully left the event',
        schema: {
            example: {
                "message": "Left activity successfully"
            }
        }
    })
    async leaveActivity(
        @Param('id') eventId: string,
        @UserDecorator() user,
    ) {
        return await this.eventService.leaveActivity(user.email, eventId);
    }


}
