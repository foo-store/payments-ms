import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('payment.create')
  create(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log({ data, context });
    return true;
  }
}
