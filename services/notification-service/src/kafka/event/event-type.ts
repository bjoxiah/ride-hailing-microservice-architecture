export enum EventType {
  // payment
  PAYMENT_RECEIVED = 'payment.received',
  INVOICE_CREATED = 'invoice.created',

  // ride
  RIDE_CREATED = 'ride.created',
  RIDE_COMPLETED = 'ride.completed',
  RIDE_STARTED = 'ride.started',
  RIDE_CANCELED = 'ride.canceled',

  // vehicle
  VEHICLE_CREATED = 'vehicle.created',
  VEHICLE_UPDATED = 'vehicle.updated',
  VEHICLE_ASSIGNED = 'vehicle.assigned',
  VEHICLE_ARRIVED = 'vehicle.arrived',
  VEHICLE_UNAVAILABLE = 'vehicle.unavailable',

  // user
  USER_UPDATED = 'user.updated',
  USER_CREATED = 'user.created',
}
