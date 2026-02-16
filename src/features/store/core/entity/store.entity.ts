import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentTypeEnum } from '@shared/interfaces/document.enum';
import { PersonTypeEnum } from './types/personType.enum';
import { PlanTypeEnum } from './types/planType.enum';

@Entity({ name: 'stores' })
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DocumentTypeEnum, default: DocumentTypeEnum.RUC, nullable: false })
  documentType: DocumentTypeEnum;

  @Column({ type: 'varchar', length: 64, nullable: false })
  documentNumber: string;

  @Index({ unique: true })
  @Column({ comment: 'Store ruc number search', type: 'varchar', length: 64, nullable: false })
  documentNumber_index: string;

  @Column({ comment: 'Logo url by store', type: 'text', nullable: true, default: null })
  logoUrl?: string;

  @Column({ comment: 'Logo base64 by store', type: 'text', nullable: true, default: null })
  logoBase64?: Base64URLString;

  @Column({ comment: 'Name store', type: 'varchar', nullable: false })
  companyName: string;

  @Column({ comment: 'Comercial name store', type: 'varchar', nullable: true, default: null })
  comercialName?: string;

  @Column({ comment: 'Email store', type: 'text', nullable: false })
  email: string;

  @Index()
  @Column({ comment: 'Store is email search', type: 'varchar', length: 64, nullable: false })
  email_index: string;

  @Column({ comment: 'Password store', type: 'text', nullable: false })
  password: string;

  @Column({ comment: 'Phone Store', type: 'text', nullable: true, default: null })
  phone?: string;

  @Column({ comment: 'Constitution date store', type: 'date', nullable: true, default: null })
  constitutionDate?: Date;

  @Column({ comment: 'Economic activity code by store', type: 'int', nullable: false })
  economicActivityCode: string;

  @Column({ comment: 'Economic activity name by store', type: 'varchar', nullable: false })
  economicActivityName: string;

  @Column({ comment: 'Type of taxpayer by store', type: 'varchar', nullable: false })
  typeOfTaxpayer: string;

  @Column({
    type: 'enum',
    enum: PersonTypeEnum,
    comment: 'Person type by store',
    nullable: false,
    default: PersonTypeEnum.NATURAL_PERSON,
  })
  personType: PersonTypeEnum;

  @Column({
    type: 'enum',
    enum: PlanTypeEnum,
    comment: 'Type of plan purchased by the store',
    nullable: false,
    default: PlanTypeEnum.FREE,
  })
  planType: PlanTypeEnum;

  @Column({ comment: 'Accept the terms and conditions', type: 'boolean', default: false })
  termsAndConditions: boolean;

  @Column({
    comment:
      'Publish the store on the platform, for this it is necessary to have configured at least one product or service',
    type: 'boolean',
    default: false,
  })
  isPublished: boolean;

  @Column({
    comment: 'The store is disabled if it has violated the service rules.',
    type: 'boolean',
    default: true,
  })
  isEnabled: boolean;

  @Column({ comment: 'Delete store', type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
