import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common';
import { ProfileService } from '@api/profile/services/profile.service';
import {
  CreateProfileDto,
  Profile,
  UpdateProfileDto
} from '@helping-hand/api-common';
import { Observable } from 'rxjs';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() profileDto: CreateProfileDto): Observable<Profile> {
    return this.profileService.create(profileDto);
  }

  @Get(':profileId')
  get(@Param('profileId') profileId: string): Observable<Profile> {
    return this.profileService.getById(profileId);
  }

  @Get()
  list(): Observable<Profile[]> {
    return this.profileService.list();
  }

  @Patch(':profileId')
  update(
    @Param('profileId') profileId: string,
    @Body() profileDto: UpdateProfileDto
  ): Observable<Profile> {
    return this.profileService.updateById(profileId, profileDto);
  }

  @Delete(':profileId')
  delete(@Param('profileId') profileId: string): Observable<any> {
    return this.profileService.delete(profileId);
  }
}
