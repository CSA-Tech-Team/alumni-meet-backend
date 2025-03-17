import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthService } from "./auth.service";
import { AuthDtos, VerifyEmailDTO, VerifyOTPDTO, UpdateUserDto, DeleteUserDTO, ChangePasswordDTO } from "./dto";
import { JwtAuthGuard } from "./strategy";
import { UserDecorator } from "src/decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("signup")
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'aklamaash17@gmail.com' },
                password: { type: 'string', example: 'Akla123%' },
                name: { type: 'string', example: 'Mohamed Aklamaash' },
                addr: { type: 'string', example: 'Coimbatore, Tamil Nadu' },
                course: { type: 'string', example: 'DS' },
                designation: { type: 'string', example: 'Student' },
                gender: { type: 'string', example: 'Male' },
                gradyear: { type: 'number', example: 2027 },
                rollno: { type: 'string', example: '21MDS001' },
                phonenumber: { type: 'string', example: '9876543210' }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'OTP verified successfully',
        schema: {
            example: {
                message: 'Verification OTP is sent',
            }
        }
    }) async signup(@Body() dto: AuthDtos) {
        return this.authService.signup(dto);
    }

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'aklamaash17@gmail.com' },
                password: { type: 'string', example: 'Akla123%' },
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'SignIn',
        schema: {
            example: {
                message: 'Signin Successful',
                access_token: "64hexstring"
            }
        }
    })
    async signin(@Body() dto: AuthDtos) {
        return this.authService.login(dto);
    }

    @Put("verifyotp")
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                email: { type: 'string', example: "aklamaash17@gmail.com" },
                otp: { type: "string", example: "1234" }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'VerifyOTP',
        schema: {
            example: {
                message: 'VerifyOTP Successful',
                access_token: "64hexstring"
            }
        }
    }) async verifyOtp(@Body() dto: VerifyOTPDTO) {
        return this.authService.verifyOTP(dto);
    }

    @Put("updateProfile")
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'aklamaash17@gmail.com' },
                password: { type: 'string', example: 'Akla123%' },
                name: { type: 'string', example: 'Mohamed Aklamaash' },
                addr: { type: 'string', example: 'Coimbatore, Tamil Nadu' },
                course: { type: 'string', example: 'DS' },
                designation: { type: 'string', example: 'Student' },
                gender: { type: 'string', example: 'Male' },
                gradyear: { type: 'number', example: 2027 },
                rollno: { type: 'string', example: '21MDS001' },
                phonenumber: { type: 'string', example: '9876543210' }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'User is updated successfully',
        schema: {
            example: {
                message: 'Updaed Profile details will be sent ',
            }
        }
    }) async updateProfile(@Body() dto: UpdateUserDto) {
        return this.authService.updateUser(dto.email, dto);
    }

    @Put("forgotPassword")
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'example@gmail.com' },
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Forgot Password',
        schema: {
            example: {
                message: 'Verification OTP will be sent ',
            }
        }
    }) async forgotPassword(@Body() dto: UpdateUserDto) {
        return this.authService.forgotPassword(dto.email);
    }

    @Delete("deleteProfile")
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'example@gmail.com' },
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Delete Profile',
        schema: {
            example: {
                message: 'User deleted Successfully ',
            }
        }
    }) async deleteProfile(@Body() dto: DeleteUserDTO) {
        return this.authService.deleteUser(dto.email);
    }

    @Put("changePassword")
    @HttpCode(HttpStatus.OK)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'example@gmail.com' },
                newpassword: { type: 'string', example: 'newPass%' },

            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Change Password ',
        schema: {
            example: {
                message: 'Password Updated Successfully ',
            }
        }
    }) async changePassword(@Body() dto: ChangePasswordDTO) {
        return this.authService.changePassword(dto);
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'Bearer <token>' })
    @ApiResponse({
        status: 200,
        description: 'Current user data',
        schema: {
            example: {
                user: {
                    sub: '1d24cb22-3af5-47e3-847e-77b8d7fc1e5c',
                    email: 'aklamaash17@gmail.com',
                    name: 'Mohamed Aklamaash',
                    rollno: '21MDS001',
                    role: 'USER',
                    iat: 1742034845,
                    exp: 1742639645
                }
            }
        }
    }) async getCurrUser(@UserDecorator() usr) {
        return { user: usr };
    }
}
