import {IsNotEmpty, IsString, IsDateString, IsUrl} from 'class-validator';

export class ClubDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsDateString()
    @IsNotEmpty()
    fecha_fundacion: string;

    @IsString()
    @IsUrl()
    imagen: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;
}
