import { IsInt, IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateUsuarioDto {
    
    @IsInt()
    @Min(1)
    dni: number;

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    contrasenia: string;
}