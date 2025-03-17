import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDtos, VerifyEmailDTO, VerifyOTPDTO, UpdateUserDto, DeleteUserDTO, ChangePasswordDTO } from "./dto";
// import { UserDecorator } from "src/decorator";
// import { Profile, User } from "@prisma/client";
// import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "./strategy";
import { UserDecorator } from "src/decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("signup")
    async signup(@Body() dto: AuthDtos) {
        return this.authService.signup(dto);
    }

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    async signin(@Body() dto: AuthDtos) {
        return this.authService.login(dto);
    }

    @Put("verifyotp")
    @HttpCode(HttpStatus.OK)
    async verifyOtp(@Body() dto: VerifyOTPDTO) {
        return this.authService.verifyOTP(dto);
    }

    @Put("updateProfile")
    @HttpCode(HttpStatus.OK)
    async updateProfile(@Body() dto: UpdateUserDto) {
        return this.authService.updateUser(dto.email, dto);
    }

    @Put("forgotPassword")
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: UpdateUserDto) {
        return this.authService.forgotPassword(dto.email);
    }

    @Delete("deleteProfile")
    @HttpCode(HttpStatus.OK)
    async deleteProfile(@Body() dto: DeleteUserDTO) {
        return this.authService.deleteUser(dto.email)
    }

    @Put("changePassword")
    @HttpCode(HttpStatus.OK)
    async changePassword(@Body() dto: ChangePasswordDTO) {
        return this.authService.changePassword(dto);
    }



    @Get("me")
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCurrUser(@UserDecorator() usr) {
        return { user: usr }
    }
}