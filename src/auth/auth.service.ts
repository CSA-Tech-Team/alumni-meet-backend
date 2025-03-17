import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDtos, ChangePasswordDTO, UpdateUserDto, VerifyOTPDTO } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { GenerateOTP } from "utils/generateOTP";
import * as nodemailer from "nodemailer";
import { Role } from "@prisma/client";

@Injectable()
export class AuthService {
    private readonly transporter: nodemailer.Transporter;

    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.config.get("SENDER_EMAIL"),
                pass: this.config.get("SENDER_PASSWORD")
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100
        });
    }

    async login(dto: AuthDtos) {
        this.validateCredentials(dto.email, dto.password);

        const [user, profile] = await Promise.all([
            this.prisma.user.findUnique({ where: { email: dto.email } }),
            this.prisma.profile.findUnique({ where: { email: this.sanitizeEmail(dto.email) } })
        ]);

        if (!user || !profile) throw new UnauthorizedException("No user found");
        if (!user.isOTPVerified) throw new HttpException("User is not OTP verified", 400);

        const isPasswordValid = await argon.verify(profile.password, dto.password);
        if (!isPasswordValid) throw new UnauthorizedException("Incorrect password");

        return this.signToken({ userId: profile.id, email: profile.email, name: profile.name, rollno: profile.rollNumber, role: user.role });
    }

    async signup(dto: AuthDtos) {
        this.validateSignupCredentials(dto);
        await this.checkExistingUser(dto.email);

        const hashedPassword = await argon.hash(dto.password);
        const otp = GenerateOTP();

        const transactionResult = await this.prisma.$transaction(async (prisma) => {
            const newUser = await prisma.user.create({
                data: {
                    email: dto.email,
                    isCompleted: false,
                    isOTPVerified: false,
                    otp,
                    role: "USER"
                }
            });

            const profile = await prisma.profile.create({
                data: {
                    userId: newUser.id,
                    name: dto.name,
                    email: dto.email,
                    password: hashedPassword,
                    gender: dto.gender,
                    rollNumber: dto.rollno,
                    phoneNumber: dto.phonenumber,
                    designation: dto.designation,
                    graduationYear: dto.gradyear,
                    address: dto.addr,
                    course: dto.course
                }
            });

            return { newUser, profile };
        });

        await this.sendMailWithRetry(dto.email, otp, 3);
        return { message: "OTP sent to email for verification", profile: transactionResult.profile };
    }

    async verifyOTP(dto: VerifyOTPDTO) {
        this.validateCredentials(dto.email, dto.otp);

        const user = await this.prisma.user.findFirst({ where: { email: dto.email } });
        if (!user || user.otp !== dto.otp) {
            throw new HttpException("Invalid OTP", 401);
        }

        const [updatedUser, userProfile] = await Promise.all([
            this.prisma.user.update({
                where: { email: dto.email },
                data: {
                    isOTPVerified: true,
                    otp: null
                }
            }),
            this.prisma.profile.findUnique({ where: { email: dto.email } })
        ]);

        if (!userProfile) throw new HttpException("Profile not found", 404);
        return this.signToken({ userId: userProfile.id, email: userProfile.email, name: userProfile.name, rollno: userProfile.rollNumber, role: user.role });
    }

    private async signToken(payload: { userId: string; email: string, name: string, rollno: string, role: Role }): Promise<{ access_token: string }> {
        const jwtSecret = this.config.get<string>("JWT_SECRET");
        if (!jwtSecret) throw new Error("JWT_SECRET is not set");

        const token = await this.jwt.signAsync(
            { sub: payload.userId, email: payload.email, name: payload.name, rollno: payload.rollno, role: payload.role },
            { expiresIn: "7d", secret: jwtSecret }
        );
        return { access_token: token };
    }

    private async sendMailWithRetry(email: string, otp: string, maxRetries: number) {
        const mailOptions = {
            from: this.config.get("SENDER_EMAIL"),
            to: email,
            subject: "OTP Verification",
            html: `<p>Your OTP for email verification: <strong>${otp}</strong></p>`
        };

        let lastError: Error;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await this.transporter.sendMail(mailOptions);
                return { success: true, message: `Mail sent to ${email}` };
            } catch (error) {
                lastError = error;
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                    continue;
                }
                console.error(`Email sending failed after ${maxRetries} attempts:`, error);
                // deleting the entries created for the user for trying to send the mail
                await this.prisma.profile.delete({
                    where: {
                        email
                    }
                })
                await this.prisma.user.delete({
                    where: { email },
                });
                throw new HttpException(
                    "Failed to send verification email. Please contact support.",
                    500
                );
            }
        }
    }

    async deleteUser(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        await this.prisma.profile.delete({ where: { email } });
        await this.prisma.user.delete({ where: { email } });
        return { message: "User deleted successfully" };
    }

    async updateUser(email: string, updateData: UpdateUserDto) {
        const profile = await this.prisma.profile.findUnique({ where: { email } });
        if (!profile) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }
        const updatedProfile = await this.prisma.profile.update({
            where: { email },
            data: {
                name: updateData.name ?? profile.name,
                gender: updateData.gender ?? profile.gender,
                rollNumber: updateData.rollno ?? profile.rollNumber,
                phoneNumber: updateData.phonenumber ?? profile.phoneNumber,
                designation: updateData.designation ?? profile.designation,
                graduationYear: updateData.gradyear ?? profile.graduationYear,
                address: updateData.addr ?? profile.address,
                course: updateData.course ?? profile.course,
            }
        });
        return { updatedProfile };
    }

    async forgotPassword(email: string) {
        const profile = await this.prisma.profile.findUnique({
            where: {
                email
            }
        })

        const usr = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!usr || !profile) {
            throw new HttpException("User with the given mail not found", HttpStatus.NOT_FOUND)
        }

        const otp = GenerateOTP()

        await this.prisma.user.update({
            where: {
                email
            },
            data: {
                isOTPVerified: false,
                otp,
                isChangingPassword: true
            }
        })

        await this.prisma.profile.update({
            where: {
                email
            },
            data: {
                password: "null"
            }
        })

        await this.sendMailWithRetry(email, otp, 3)

        return { message: "Forgot Password Process initialized otp sent", usr, profile }
    }

    async changePassword(dto: ChangePasswordDTO) {
        const profile = await this.prisma.profile.findUnique({
            where: {
                email: dto.email
            }
        })

        const usr = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!usr || !profile) {
            throw new HttpException("User with the given mail not found", HttpStatus.NOT_FOUND)
        }

        if (!usr.isChangingPassword || !usr.isOTPVerified) {
            throw new HttpException("forgot password process is not initialized or OTP isn't verified", HttpStatus.UNAUTHORIZED)
        }

        const hashedPassword = await argon.hash(dto.newpassword)
        await this.prisma.profile.update({
            where: {
                email: dto.email
            },
            data: {
                password: hashedPassword
            }
        })

        return { message: "Password updated successfully", profile }

    }

    private validateCredentials(email: string, credential: string) {
        if (!email || !credential) {
            throw new HttpException("Email and required credential are necessary", 400);
        }
    }

    private validateSignupCredentials(dto: AuthDtos) {
        if (!dto.email || !dto.password || !dto.name) {
            throw new HttpException("Email, password, and name are required", 400);
        }
    }

    private async checkExistingUser(email: string) {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new HttpException("User already exists", 400);
    }

    private sanitizeEmail(email: string): string {
        return email.replace(/['"]/g, '');
    }

    async getUsersNeedingManualVerification() {
        return this.prisma.user.findMany({
            where: { needsManualVerification: true },
            select: {
                email: true,
                createdAt: true,
                role: true
            }
        });
    }
}