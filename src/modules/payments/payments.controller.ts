import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Request, Response } from 'express';
import { CreatePaymentSessionDto } from './dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('payment.session.create')
  createPaymentSession(
    @Payload() data: CreatePaymentSessionDto,
    // @Ctx() context: RmqContext,
  ) {
    // const channel = context.getChannelRef();
    // const originalMsg = context.getMessage();

    // channel.ack(originalMsg);

    return this.paymentsService.createPaymentSession(data);
  }

  @Post('webhook')
  stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res);
  }

  @Get('success')
  paymentSuccess() {
    return { success: true };
  }
}
