import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CompleteprofiledetailsService } from './completeprofiledetails.service';
import { ProfileCompleteDTO } from './dto';
import { UserDecorator } from 'src/decorator';
import { JwtAuthGuard } from 'src/auth/strategy';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('completeprofiledetails') // Groups endpoints under this tag in Swagger UI
@UseGuards(JwtAuthGuard)
@ApiBearerAuth() // Indicates that endpoints require JWT authentication
@Controller('completeprofiledetails')
export class CompleteprofiledetailsController {
  constructor(private readonly completeprofiledetailsService: CompleteprofiledetailsService) {}

  @Put('')
  @ApiOperation({ summary: 'Complete a user profile' })
  @ApiBody({ type: ProfileCompleteDTO }) 
  @ApiResponse({ status: 200, description: 'Profile successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  async completeProfile(
    @UserDecorator() usr, 
    @Body() dto: ProfileCompleteDTO,
  ) {
    return this.completeprofiledetailsService.completeProfile(usr.email, dto);
  }

  @Get('foodPreferenceCount')
  @ApiOperation({ summary: 'Get count of users by food preference' })
  @ApiResponse({ status: 200, description: 'Returns a count of users grouped by food preference' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async getFoodPreferenceCount() {
    return this.completeprofiledetailsService.getFoodPrefernceCount();
  }

  @Get('genderCount')
  @ApiOperation({ summary: 'Get count of users by gender' })
  @ApiResponse({ status: 200, description: 'Returns a count of users grouped by gender' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async getGenderBasedCount() {
    return this.completeprofiledetailsService.getGenderBasedCount();
  }

  @Get('gradYearCount')
  @ApiOperation({ summary: 'Get count of users by graduation year' })
  @ApiResponse({ status: 200, description: 'Returns a count of users grouped by graduation year' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async getCountOfEachGradYear() {
    return this.completeprofiledetailsService.getCountOfEachGradYear();
  }
}