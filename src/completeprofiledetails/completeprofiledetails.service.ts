import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileCompleteDTO } from './dto';
import { FoodPreference, Gender } from '@prisma/client';

@Injectable()
export class CompleteprofiledetailsService {
    constructor(private readonly prisma: PrismaService) { }

    async completeProfile(email: string, dto: ProfileCompleteDTO) {

        const usr = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        const profile = await this.prisma.profile.findUnique({
            where: {
                email
            }
        })

        if (!usr || !profile) {
            throw new HttpException(`No user with the mail id:${email} is found.`, HttpStatus.NOT_FOUND)
        }


        await this.prisma.profile.update({
            where: {
                email
            },
            data: {
                gender: dto.gender || profile.gender,
                address: dto.addr || profile.address,
                course: dto.course || profile.course,
                designation: dto.designation || profile.designation,
                graduationYear: dto.gradyear || profile.graduationYear,
                phoneNumber: dto.phonenumber || profile.phoneNumber,
                rollNumber: dto.rollno || profile.rollNumber,
                userId: usr.id || profile.userId
            }
        })

        const user = await this.prisma.user.update({
            where: {
                email
            },
            data: {
                foodPreference: dto.foodPreference,
                isCompleted: true
            }
        })

        return { message: "Profile updated successfully", isProfileComplete: user.isCompleted }
    }

    async getFoodPrefernceCount() {
        const vegFoodCount = await this.prisma.user.count({
            where: {
                foodPreference: FoodPreference.Veg
            }
        })

        const nonvegFoodCount = await this.prisma.user.count({
            where: {
                foodPreference: FoodPreference.NonVeg
            }
        })

        return { vegFoodCount, nonvegFoodCount }
    }

    async getGenderBasedCount() {
        const maleCount = await this.prisma.profile.count({
            where: {
                gender: Gender.Male
            }
        })

        const femaleCount = await this.prisma.profile.count({
            where: {
                gender: Gender.Female
            }
        })

        const prefNotCount = await this.prisma.profile.count({
            where: {
                gender: Gender.PreferNotToSay
            }
        })

        return { maleCount, femaleCount, prefNotCount }

    }

    async getCountOfEachGradYear() {
        const gradYearCount = await this.prisma.profile.groupBy({
            by: ['graduationYear'],
            _count: {
                graduationYear: true
            }
        });
        return { gradYearCount }
    }



}
