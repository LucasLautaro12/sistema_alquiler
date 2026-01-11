import { IsNotEmpty, IsNumber, IsOptional, MinLength } from "class-validator";

export class UpdateUsuarioDto {
    @IsOptional()
    @IsNotEmpty()
    nombre?: string;

    @IsOptional()
    @MinLength(6)
    contrasenia?: string;
}