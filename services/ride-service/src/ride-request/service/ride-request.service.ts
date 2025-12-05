import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RideRequest } from '../entity/ride-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRideRequestDto } from '../dto/create-ride-request.dto';
import { KafkaService } from 'src/kafka/service/kafka.service';
import { BaseEvent } from 'src/kafka/event/base.event'; // Import EventData interface too
import { EventType } from 'src/kafka/event/event-type';
import { RideRequestedEventPayload } from '../events/ride-request.event';

@Injectable()
export class RideRequestService {
  constructor(
    @InjectRepository(RideRequest)
    private rideRequestRepository: Repository<RideRequest>,
    private kafka: KafkaService,
  ) {}

  async create(createDto: CreateRideRequestDto): Promise<RideRequest> {
    // 1. Map the flat DTO structure to the entity structure for persistence
    const newRideRequest = this.rideRequestRepository.create({
      riderId: createDto.riderId,
      // Note: driverId is missing in the create DTO you provided previously,
      // so it might be null/undefined initially, which is fine.
      originName: createDto.origin.name,
      originCoordinates: createDto.origin.latlong,
      destinationName: createDto.destination.name,
      destinationCoordinates: createDto.destination.latlong,
    });

    // 2. Use the repository's 'save' method to interact with the database
    // The 'response' object will now have the generated 'id' (UUID) and timestamps.
    const response = await this.rideRequestRepository.save(newRideRequest);

    // 3. After saving, publish an event to Kafka

    // Create the specific data payload using data from the saved entity
    const eventPayloadData: RideRequestedEventPayload = {
      id: response.id,
      rider_id: response.riderId,
      origin_coordinates: response.originCoordinates,
      origin_name: response.originName,
      destination_coordinates: response.destinationCoordinates,
      destination_name: response.destinationName,
      created_at: response.createdAt,
    };

    // Instantiate the generic BaseEvent class correctly using the 'new' keyword
    const rideRequestedEvent = new BaseEvent<RideRequestedEventPayload>(
      eventPayloadData,
      EventType.RIDE_REQUESTED,
    );

    // Send the event via the Kafka service
    await this.kafka.send(EventType.RIDE_REQUESTED, rideRequestedEvent);

    // 4. Return the saved entity
    return response;
  }
}
