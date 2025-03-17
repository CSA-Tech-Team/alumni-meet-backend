import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Course, Gender, Role } from "@prisma/client";

export class AuthDtos {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,30}$/)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  role: Role;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rollno: string;

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

export class VerifyOTPDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class VerifyEmailDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateUserDto {
  @ApiProperty()
  email: string;
  name?: string;
  gender?: Gender;
  rollno?: string;
  phonenumber?: string;
  designation?: string;
  gradyear?: number;
  addr?: string;
  course?: Course;
}

export class DeleteUserDTO {
  @ApiProperty()
  email: string;
}

export class ForgotPasswordDTO {
  @ApiProperty()
  email: string;
}

export class ChangePasswordDTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  newpassword: string;
}
