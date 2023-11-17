import {IsNotEmpty, IsString, IsDateString} from 'class-validator';

export class SocioDto {

    @IsString()
    @IsNotEmpty()
    usuario: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsDateString()
    @IsNotEmpty()
    fecha_nacimiento: string
}
