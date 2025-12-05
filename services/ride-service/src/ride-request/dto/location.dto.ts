import { ApiProperty } from '@nestjs/swagger';
import { IsLatLong, IsString } from 'class-validator';

export class LocationDto {
  @IsLatLong()
  @ApiProperty({
    example: '40.712776,-74.005974',
    description: 'Latitude and Longitude string (e.g., "lat,long")',
  })
  latlong: string;

  @IsString()
  @ApiProperty({
    example: 'New York, NY',
    description: 'Name of the location',
  })
  name: string;
}
