import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUsuarioDto {
    @IsNotEmpty()
    @IsNumber()
    dni: number;

    @IsNotEmpty()
    nombre: string;
}