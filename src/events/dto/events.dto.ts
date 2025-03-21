import { Events } from "@prisma/client";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateActivityDto {
    @IsString()
    @IsNotEmpty()
    eventName: Events;

    @IsString()
    @IsNotEmpty()
    about: string;
}

export class UpdateActivityDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    eventName?: Events;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    about?: string;
}

export class GetActivityDetailsDTO {
    @IsString()
    @IsNotEmpty()
    event: Events

    @IsString()
    @IsOptional()
    songDetails?: string

    @IsString()
    @IsOptional()
    topic?: string;

    @IsBoolean()
    @IsOptional()
    needKaroke?: boolean;
}

export class postAGallertPicDTO {
    @IsString()
    @IsNotEmpty()
    imageUrl: string
}

