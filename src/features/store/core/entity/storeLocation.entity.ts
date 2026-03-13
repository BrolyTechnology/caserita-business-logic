import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Point } from 'geojson';

@Entity('storeLocation')
export class StoreLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    comment: 'Reference to the store that owns this container',
    type: 'uuid',
    nullable: false,
  })
  storeId: string;

  @Column({ comment: 'Store address', type: 'text', nullable: false })
  address: string;

  @Column({ comment: 'Store address reference', type: 'text', nullable: false })
  reference: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  geographicalLocation: Point;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}

// STRUCTURE GEOGRAPHY POLYGON
// @Index({ spatial: true })
//   @Column({
//     type: 'geography',
//     spatialFeatureType: 'Polygon',
//     srid: 4326,
//     nullable: false,
//   })
// geographicalLocation: Polygon;

// INSERTION DATA
// storeArea.geographicalLocation = {
//   type: 'Polygon',
//   coordinates: [
//     [
//       [-77.01, -12.01], // Punto A (Inicio)
//       [-77.02, -12.01], // Punto B
//       [-77.02, -12.02], // Punto C
//       [-77.01, -12.02], // Punto D
//       [-77.01, -12.01]  // Punto A (Cierre del polígono - OBLIGATORIO)
//     ]
//   ]
// };
