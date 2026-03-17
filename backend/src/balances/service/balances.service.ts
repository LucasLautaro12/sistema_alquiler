import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from '../entities/balances.entity';
import { GastosMensualesService } from '../../gastos-mensuales/service/gastos-mensuales.service';
import { GastoMensual } from '../../gastos-mensuales/entities/gasto-mensual.entity';
import { Usuarios } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(Balance)
    private readonly balancesRepository: Repository<Balance>,
    @InjectRepository(GastoMensual)
    private readonly gastosMensualesRepository: Repository<GastoMensual>,
    @InjectRepository(Usuarios)
    private readonly usuariosRepository: Repository<Usuarios>,
    private readonly gastosMensualesService: GastosMensualesService,
  ) {}

  /**
   * Genera (o regenera) los balances de todos los usuarios para un mes dado.
   * Si ya existen, los sobreescribe para mantener consistencia.
   */
  async generarBalancesMensual(mes: number, anio: number): Promise<Balance[]> {
    const resumen = await this.gastosMensualesService.getResumenMensual(mes, anio);
    const gastoMensual = await this.gastosMensualesRepository.findOne({
      where: { mes, anio },
    });

    if (!gastoMensual) {
      throw new NotFoundException(`No existe gasto mensual para ${mes}/${anio}`);
    }

    const balancesGuardados: Balance[] = [];

    for (const ru of resumen.resumenUsuarios) {
      const usuario = await this.usuariosRepository.findOne({
        where: { dni: ru.usuario.dni },
      });
      if (!usuario) continue;

      // Buscar balance existente para este usuario y mes
      let balance = await this.balancesRepository.findOne({
        where: {
          usuario: { dni: usuario.dni },
          gastoMensual: { id: gastoMensual.id },
        },
      });

      if (!balance) {
        balance = this.balancesRepository.create({
          usuario,
          gastoMensual,
        });
      }

      balance.montoBase = ru.montoBase;
      balance.totalPagado = ru.totalPagado;
      balance.deudaFinal = ru.deudaFinal;

      balancesGuardados.push(await this.balancesRepository.save(balance));
    }

    return balancesGuardados;
  }

  async findByMesAnio(mes: number, anio: number): Promise<Balance[]> {
    const gastoMensual = await this.gastosMensualesRepository.findOne({
      where: { mes, anio },
    });
    if (!gastoMensual) {
      throw new NotFoundException(`No existe gasto mensual para ${mes}/${anio}`);
    }

    return this.balancesRepository.find({
      where: { gastoMensual: { id: gastoMensual.id } },
      relations: ['usuario', 'gastoMensual'],
    });
  }

  async findByUsuario(dni: number): Promise<Balance[]> {
    const usuario = await this.usuariosRepository.findOne({ where: { dni } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con DNI ${dni} no encontrado`);
    }

    return this.balancesRepository.find({
      where: { usuario: { dni } },
      relations: ['usuario', 'gastoMensual'],
      order: { gastoMensual: { anio: 'DESC', mes: 'DESC' } },
    });
  }

  async findAll(): Promise<Balance[]> {
    return this.balancesRepository.find({
      relations: ['usuario', 'gastoMensual'],
      order: { gastoMensual: { anio: 'DESC', mes: 'DESC' } },
    });
  }
}