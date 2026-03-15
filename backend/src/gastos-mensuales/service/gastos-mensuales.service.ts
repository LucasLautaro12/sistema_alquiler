// src/gastos-mensuales/service/gastos-mensuales.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GastoMensual } from '../entities/gasto-mensual.entity';
import { CreateGastoMensualDto } from '../dtos/create-gasto-mensual.dto';
import { UpdateGastoMensualDto } from '../dtos/update-gasto-mensual.dto';
import { UsuariosService } from '../../usuarios/service/usuarios.service';

const MESES_NOMBRES: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre',
};

@Injectable()
export class GastosMensualesService {
  constructor(
    @InjectRepository(GastoMensual)
    private readonly gastoRepository: Repository<GastoMensual>,
    private readonly usuariosService: UsuariosService,
  ) {}

  async create(dto: CreateGastoMensualDto): Promise<GastoMensual> {
    // Verificar que no exista un registro para ese mes/año
    const existe = await this.gastoRepository.findOne({
      where: { mes: dto.mes, anio: dto.anio },
    });
    if (existe) {
      throw new ConflictException(
        `Ya existe un registro para ${MESES_NOMBRES[dto.mes]} ${dto.anio}`,
      );
    }

    const gasto = this.gastoRepository.create({
      mes: dto.mes,
      anio: dto.anio,
      alquiler: dto.alquiler,
      gas: dto.gas,
      luz_agua: dto.luz_agua,
      expensas: dto.expensas,
    });

    // Asignar pagadores si se proporcionaron los DNIs
    if (dto.pagador_gas_dni) {
      gasto.pagador_gas = await this.usuariosService.findOne(dto.pagador_gas_dni);
    }
    if (dto.pagador_luz_agua_dni) {
      gasto.pagador_luz_agua = await this.usuariosService.findOne(dto.pagador_luz_agua_dni);
    }
    if (dto.pagador_expensas_dni) {
      gasto.pagador_expensas = await this.usuariosService.findOne(dto.pagador_expensas_dni);
    }

    return this.gastoRepository.save(gasto);
  }

  async findAll(): Promise<GastoMensual[]> {
    return this.gastoRepository.find({
      order: { anio: 'DESC', mes: 'DESC' },
    });
  }

  async findOne(id: number): Promise<GastoMensual> {
    const gasto = await this.gastoRepository.findOne({ where: { id } });
    if (!gasto) {
      throw new NotFoundException(`Gasto mensual con ID ${id} no encontrado`);
    }
    return gasto;
  }

  async update(id: number, dto: UpdateGastoMensualDto): Promise<GastoMensual> {
    const gasto = await this.findOne(id);

    // Si se cambia mes/año, verificar que no haya conflicto
    const nuevoMes = dto.mes ?? gasto.mes;
    const nuevoAnio = dto.anio ?? gasto.anio;
    if (dto.mes !== undefined || dto.anio !== undefined) {
      const conflicto = await this.gastoRepository.findOne({
        where: { mes: nuevoMes, anio: nuevoAnio },
      });
      if (conflicto && conflicto.id !== id) {
        throw new ConflictException(
          `Ya existe un registro para ${MESES_NOMBRES[nuevoMes]} ${nuevoAnio}`,
        );
      }
    }

    // Actualizar campos simples
    if (dto.mes !== undefined) gasto.mes = dto.mes;
    if (dto.anio !== undefined) gasto.anio = dto.anio;
    if (dto.alquiler !== undefined) gasto.alquiler = dto.alquiler;
    if (dto.gas !== undefined) gasto.gas = dto.gas;
    if (dto.luz_agua !== undefined) gasto.luz_agua = dto.luz_agua;
    if (dto.expensas !== undefined) gasto.expensas = dto.expensas;

    // Actualizar pagadores (null limpia el pagador, undefined no cambia nada)
    if (dto.pagador_gas_dni !== undefined) {
      gasto.pagador_gas = dto.pagador_gas_dni
        ? await this.usuariosService.findOne(dto.pagador_gas_dni)
        : null;
    }
    if (dto.pagador_luz_agua_dni !== undefined) {
      gasto.pagador_luz_agua = dto.pagador_luz_agua_dni
        ? await this.usuariosService.findOne(dto.pagador_luz_agua_dni)
        : null;
    }
    if (dto.pagador_expensas_dni !== undefined) {
      gasto.pagador_expensas = dto.pagador_expensas_dni
        ? await this.usuariosService.findOne(dto.pagador_expensas_dni)
        : null;
    }

    return this.gastoRepository.save(gasto);
  }

  async getResumen(id: number) {
    const gasto = await this.findOne(id);

    // Convertir decimales de la BD a números seguros
    const alquiler = Number(gasto.alquiler);
    const gas = Number(gasto.gas);
    const luz_agua = Number(gasto.luz_agua);
    const expensas = Number(gasto.expensas);

    const total = alquiler + gas + luz_agua + expensas;
    const montoPorUsuario = parseFloat((total / 3).toFixed(2));

    // Obtener todos los usuarios del sistema
    const todosLosUsuarios = await this.usuariosService.findAll();

    // Calcular cuánto pagó cada usuario en servicios
    const pagos: Record<number, number> = {};
    for (const u of todosLosUsuarios) {
      pagos[u.dni] = 0;
    }

    if (gasto.pagador_gas) {
      pagos[gasto.pagador_gas.dni] = (pagos[gasto.pagador_gas.dni] ?? 0) + gas;
    }
    if (gasto.pagador_luz_agua) {
      pagos[gasto.pagador_luz_agua.dni] = (pagos[gasto.pagador_luz_agua.dni] ?? 0) + luz_agua;
    }
    if (gasto.pagador_expensas) {
      pagos[gasto.pagador_expensas.dni] = (pagos[gasto.pagador_expensas.dni] ?? 0) + expensas;
    }

    // Construir el desglose por usuario
    const detalleUsuarios = todosLosUsuarios.map((usuario) => {
      const pagado = pagos[usuario.dni] ?? 0;
      const debePagar = parseFloat((montoPorUsuario - pagado).toFixed(2));

      const serviciosPagados: string[] = [];
      if (gasto.pagador_gas?.dni === usuario.dni) {
        serviciosPagados.push(`Gas ($${gas.toFixed(2)})`);
      }
      if (gasto.pagador_luz_agua?.dni === usuario.dni) {
        serviciosPagados.push(`Luz/Agua ($${luz_agua.toFixed(2)})`);
      }
      if (gasto.pagador_expensas?.dni === usuario.dni) {
        serviciosPagados.push(`Expensas ($${expensas.toFixed(2)})`);
      }

      return {
        dni: usuario.dni,
        nombre: usuario.nombre,
        servicios_pagados: serviciosPagados.length > 0 ? serviciosPagados : ['Nada'],
        total_pagado: parseFloat(pagado.toFixed(2)),
        debe_pagar: debePagar,
      };
    });

    return {
      periodo: `${MESES_NOMBRES[gasto.mes]} ${gasto.anio}`,
      mes: gasto.mes,
      anio: gasto.anio,
      detalle_servicios: {
        alquiler,
        gas,
        luz_agua,
        expensas,
      },
      total_gastos: parseFloat(total.toFixed(2)),
      monto_por_usuario: montoPorUsuario,
      usuarios: detalleUsuarios,
    };
  }
}
