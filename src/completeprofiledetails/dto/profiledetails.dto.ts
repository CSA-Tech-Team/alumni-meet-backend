import { FoodPreference } from "@prisma/client";
import { IsString } from "class-validator";

export class ProfileCompleteDTO {

    @IsString()
    foodPreference:FoodPreference
}