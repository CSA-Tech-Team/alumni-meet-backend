import { ApiProperty } from "@nestjs/swagger";
import { Course, FoodPreference, Gender } from "@prisma/client";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class ProfileCompleteDTO {

    @IsString()
    foodPreference: FoodPreference

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    rollno: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gender: Gender;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phonenumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    designation: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    gradyear: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    addr: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    course: Course;

}