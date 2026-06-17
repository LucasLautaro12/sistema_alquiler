import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Match } from '../../matches/entities/match.entity';

@Unique(['userId', 'matchId'])
@Entity('predictions')
export class Prediction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', name: 'user_id' })
  @Index()
  userId: number;

  @ManyToOne(() => Match)
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @Column({ type: 'int', name: 'match_id' })
  @Index()
  matchId: number;

  @Column({ type: 'int', name: 'home_score' })
  homeScore: number;

  @Column({ type: 'int', name: 'away_score' })
  awayScore: number;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'boolean', default: false, name: 'is_exact' })
  isExact: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_correct_outcome' })
  isCorrectOutcome: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_scored' })
  isScored: boolean;
}
