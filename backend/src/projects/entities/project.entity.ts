import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ProjectStatus {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDO = 'concluido',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PENDENTE,
  })
  status!: ProjectStatus;

  @Column({ type: 'int', default: 0 })
  agilidade!: number;

  @Column({ type: 'int', default: 0 })
  encantamento!: number;

  @Column({ type: 'int', default: 0 })
  eficiencia!: number;

  @Column({ type: 'int', default: 0 })
  excelencia!: number;

  @Column({ type: 'int', default: 0 })
  transparencia!: number;

  @Column({ type: 'int', default: 0 })
  ambicao!: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'responsibleId' })
  responsible!: User;

  @Column()
  responsibleId!: number;
}
