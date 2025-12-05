import { IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LocationDto } from './location.dto';

export class CreateRideRequestDto {
  @IsUUID()
  @ApiProperty({ example: 'some-uuid-string', description: 'ID of the rider' })
  riderId: string;

  @ValidateNested()
  @Type(() => LocationDto) // Required by class-transformer to know the target type
  @ApiProperty({ type: LocationDto })
  origin: LocationDto;

  @ValidateNested()
  @Type(() => LocationDto)
  @ApiProperty({ type: LocationDto })
  destination: LocationDto;
}
