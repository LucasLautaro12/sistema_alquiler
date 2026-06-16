import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'table_name' })
  @Index()
  tableName: string;

  @Column({ type: 'int', name: 'record_id' })
  @Index()
  recordId: number;

  @Column({ type: 'varchar', length: 20 })
  action: string;

  @Column({ type: 'jsonb', name: 'old_values', nullable: true })
  oldValues: Record<string, any> | null;

  @Column({ type: 'jsonb', name: 'new_values', nullable: true })
  newValues: Record<string, any> | null;

  @Column({ type: 'int', name: 'user_id', nullable: true })
  @Index()
  userId: number | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
