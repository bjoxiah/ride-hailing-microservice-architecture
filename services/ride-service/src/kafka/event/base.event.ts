import { EventType } from './event-type';

/**
 * Interface representing the structure of nested event data (payload).
 * 'T' is a generic constraint ensuring the data is an object.
 */
export interface EventData {
  // Define common properties for your specific event payloads here if necessary
  // For example:
  // entityId: string;
  // status: 'created' | 'updated' | 'deleted';
  [key: string]: any; // Allows T to be any object for maximum flexibility
}

/**
 * Represents a generic base event wrapper for Kafka messages.
 * Matches the C# structure provided.
 */
export class BaseEvent<T extends EventData> {
  // Event properties with initialization matching the C# 'init' and default values
  public readonly event_id: string = crypto.randomUUID(); // Use Node's built-in crypto module
  public readonly occurred_at: string = new Date().toISOString(); // ISO 8601 string for compatibility

  // Hardcoded values matching the C# defaults
  public readonly source_service: string = 'ride-service';

  // Required properties set via constructor
  public readonly event_type: string;
  public readonly data: T;
  public readonly correlation_id: string; // Optional GUID/UUID string

  /**
   * Constructs a new BaseEvent instance.
   * @param data The specific payload of the event.
   * @param eventType A string identifier for the event type (e.g., 'vehicle-created').
   * @param correlationId An optional UUID string to link related events.
   */
  constructor(
    data: T,
    event_type: string = EventType.RIDE_REQUESTED,
    correlation_id: string = crypto.randomUUID(),
  ) {
    if (!data) {
      throw new Error('Data cannot be null or undefined.');
    }
    this.data = data;
    this.event_type = event_type;
    this.correlation_id = correlation_id;
  }
}

// --- Example Usage (Optional, remove from final file if not needed) ---

// // 1. Define a specific data payload interface
// interface VehicleCreatedDataPayload extends EventData {
//   vehicleId: string;
//   make: string;
//   model: string;
// }

// // 2. Instantiate a specific event
// const myEventPayload: VehicleCreatedDataPayload = {
//   vehicleId: 'a81bc81b-dead-4e5d-abff-90865d1e13b1',
//   make: 'Toyota',
//   model: 'Corolla',
// };

// const vehicleCreatedEvent = new BaseEvent<VehicleCreatedDataPayload>(
//   myEventPayload,
//   'vehicle.created.v1',
//   'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', // Optional correlation ID
// );

// console.log(JSON.stringify(vehicleCreatedEvent, null, 2));

// /*
// Example output:

// {
//   "eventId": "...", // a new UUID
//   "occurredAt": "2025-12-05T14:38:00.000Z",
//   "sourceService": "vehicle-service",
//   "eventType": "vehicle.created.v1",
//   "data": {
//     "vehicleId": "a81bc81b-dead-4e5d-abff-90865d1e13b1",
//     "make": "Toyota",
//     "model": "Corolla"
//   },
//   "correlationId": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e"
// }
// */
