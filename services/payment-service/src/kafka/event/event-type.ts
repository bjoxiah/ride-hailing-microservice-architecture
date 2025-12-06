export enum EventType {
  // emit
  PAYMENT_RECEIVED = 'payment.received',
  INVOICE_CREATED = 'invoice.created',

  // consume
  RIDE_COMPLETED = 'ride.completed',
  USER_UPDATED = 'user.updated',
  USER_CREATED = 'user.created',
}
