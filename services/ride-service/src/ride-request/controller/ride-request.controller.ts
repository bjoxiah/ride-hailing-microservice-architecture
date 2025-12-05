import { Body, Controller, Post } from '@nestjs/common';
import { RideRequestService } from '../service/ride-request.service';
import { CreateRideRequestDto } from '../dto/create-ride-request.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ride-request')
@Controller('ride-request')
export class RideRequestController {
  constructor(private readonly rideRequestService: RideRequestService) {}

  @ApiOperation({ summary: 'Create a ride request' })
  @ApiResponse({ status: 201, description: 'Ride request created.' })
  @ApiBody({ type: CreateRideRequestDto })
  @Post()
  // The ValidationPipe is applied globally or here specifically
  create(
    @Body()
    createDto: CreateRideRequestDto,
  ) {
    // Data received here is guaranteed to be valid and transformed into the DTO class instance
    return this.rideRequestService.create(createDto);
  }
}
