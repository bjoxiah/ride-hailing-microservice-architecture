import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../entity/invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async create(invoiceData: Partial<Invoice>): Promise<Invoice> {
    const invoice = this.invoiceRepository.create(invoiceData);
    return this.invoiceRepository.save(invoice);
  }

  async update(id: string, updateData: Partial<Invoice>): Promise<Invoice> {
    await this.invoiceRepository.update(id, updateData);
    return this.invoiceRepository.findOneBy({ id });
  }

  async calculateFare(
    originCoordinates: string,
    destinationCoordinates: string,
  ): Promise<number> {
    const originCoordsArray = originCoordinates.split(',').map(Number);
    const destinationCoordsArray = destinationCoordinates
      .split(',')
      .map(Number);

    if (
      originCoordsArray.length !== 2 ||
      destinationCoordsArray.length !== 2 ||
      originCoordsArray.some(isNaN) ||
      destinationCoordsArray.some(isNaN)
    ) {
      throw new Error('Invalid coordinates format');
    }

    const distance = this.getDistanceFromLatLonInKm(
      originCoordsArray[1],
      originCoordsArray[0],
      destinationCoordsArray[1],
      destinationCoordsArray[0],
    );
    const baseFare = 5; // Base fare in currency units
    const perKmRate = 2; // Rate per kilometer in currency units
    const fare = baseFare + distance * perKmRate;
    return parseFloat(fare.toFixed(2));
  }

  private getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
