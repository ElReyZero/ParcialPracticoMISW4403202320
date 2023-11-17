import { Controller, UseInterceptors, Get, Post, Put, Delete, HttpCode, Param, Body } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { plainToInstance } from 'class-transformer';
import { SocioDto } from '../socio/socio.dto';
import { SocioEntity } from '../socio/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {

    constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':clubId/members/:memberId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
        return await this.clubSocioService.addMemberToClub(clubId, memberId);
    }

    @Get(':clubId/members/:memberId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
        return await this.clubSocioService.findMemberFromClub(clubId, memberId);
    }

    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string){
        return await this.clubSocioService.findMembersFromClub(clubId);
    }

    @Put(':clubId/members')
    async updateMembersFromClub(@Body() membersDto: SocioDto[], @Param('clubId') clubId: string){
        const members = plainToInstance(SocioEntity, membersDto)
        return await this.clubSocioService.updateMembersFromClub(clubId, members);
    }

    @Delete(':clubId/members/:memberId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string){
        return await this.clubSocioService.deleteMemberFromClub(clubId, memberId);
    }
}
