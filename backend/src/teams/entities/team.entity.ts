import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity('teams')
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 3 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'flag_url' })
  flagUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'logo_url' })
  logoUrl: string | null;

  @Column({ type: 'int', nullable: true, name: 'external_id' })
  externalId: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  group: string | null;
}
