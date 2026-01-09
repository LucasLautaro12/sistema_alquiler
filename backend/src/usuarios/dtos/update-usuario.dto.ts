import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateUsuarioDto {
    @IsNotEmpty()
    @IsNumber()
    dni?: number;

    @IsNotEmpty()
    nombre?: string;
}