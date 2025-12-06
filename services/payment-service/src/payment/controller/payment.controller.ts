import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentService } from '../service/payment.service';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Make a payment' })
  @ApiResponse({ status: 201, description: 'Payment completed.' })
  @ApiBody({ type: CreatePaymentDto })
  @Post()
  processPayment(@Body() createDto: CreatePaymentDto) {
    return this.paymentService.create(createDto);
  }
}
