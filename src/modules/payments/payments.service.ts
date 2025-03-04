import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { catchError } from 'rxjs';
import { NATS_CLIENT } from 'src/common/constants';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { CreatePaymentSessionDto, PaymentSessionDto } from './dto';
import { StripePayload } from './interfaces';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  constructor(@Inject(NATS_CLIENT) private readonly natsProxy: ClientProxy) {}

  async createPaymentSession(
    createPaymentSessionDto: CreatePaymentSessionDto,
  ): Promise<PaymentSessionDto> {
    const { currency, items, orderId } = createPaymentSessionDto;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        price_data: {
          currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }),
    );

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: { orderId },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.successUrl,
      cancel_url: envs.cancelUrl,
    });

    return {
      cancelUrl: session.cancel_url!,
      successUrl: session.success_url!,
      url: session.url!,
    };
  }

  async stripeWebhook(req: Request, res: Response) {
    const event: Stripe.Event = req.body;

    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        const payload: StripePayload = {
          stripePaymentId: chargeSucceeded.id,
          orderId: chargeSucceeded.metadata.orderId,
          receiptUrl: chargeSucceeded.receipt_url,
        };

        this.natsProxy
          .emit<any, StripePayload>('payment.succeeded', payload)
          .pipe(
            catchError((error) => {
              throw new RpcException(error);
            }),
          );

        break;
      default:
        console.log(`Unhandled event ${event.type}`);
    }

    res.json({ received: true });
  }
}
