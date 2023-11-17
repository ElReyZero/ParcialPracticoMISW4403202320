import { Module } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubSocioController } from './club-socio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SocioEntity, ClubEntity])],
  providers: [ClubSocioService],
  controllers: [ClubSocioController],
})
export class ClubSocioModule {}
