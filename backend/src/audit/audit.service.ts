import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async log(params: {
    tableName: string;
    recordId: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    oldValues?: Record<string, any> | null;
    newValues?: Record<string, any> | null;
    userId?: number | null;
  }): Promise<AuditLog> {
    const log = this.auditRepository.create({
      tableName: params.tableName,
      recordId: params.recordId,
      action: params.action,
      oldValues: params.oldValues ?? null,
      newValues: params.newValues ?? null,
      userId: params.userId ?? null,
    });
    return this.auditRepository.save(log);
  }

  async findByTableAndRecord(
    tableName: string,
    recordId: number,
  ): Promise<AuditLog[]> {
    return this.auditRepository.find({
      where: { tableName, recordId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(
    page = 1,
    limit = 50,
  ): Promise<{ data: AuditLog[]; total: number }> {
    const [data, total] = await this.auditRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }
}
