import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { Course, Gender, Role } from "@prisma/client";

export class AuthDtos {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,30}$/)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  gender: Gender

  @IsString()
  @IsOptional()
  role: Role

  @IsString()
  @IsNotEmpty()
  rollno: string

  @IsString()
  @IsNotEmpty()
  phonenumber: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsNotEmpty()
  gradyear: number

  @IsString()
  @IsNotEmpty()
  addr: string

  @IsString()
  @IsNotEmpty()
  course: Course
}

export class VerifyOTPDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class VerifyEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateUserDto {
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
  email: string;
}


export class ForgotPasswordDTO {
  email: string
}

export class ChangePasswordDTO {
  email: string
  newpassword: string
}