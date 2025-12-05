import { EventData } from 'src/kafka/event/base.event';

export interface RideRequestedEventPayload extends EventData {
  id: string;
  rider_id: string;
  origin_coordinates: string;
  origin_name: string;
  destination_coordinates: string;
  destination_name: string;
  created_at: Date;
}
