import { IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  riderId: string;

  @IsUUID()
  driverId: string;

  @IsUUID()
  invoiceId: string;

  @IsUUID()
  rideRequestId: string;

  @IsString()
  paymentMethod: string;
}
