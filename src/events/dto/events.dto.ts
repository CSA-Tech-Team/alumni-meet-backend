import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateActivityDto {
    @IsString()
    @IsNotEmpty()
    eventName: string;

    @IsString()
    @IsNotEmpty()
    about: string;
}

export class UpdateActivityDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    eventName?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    about?: string;
}

