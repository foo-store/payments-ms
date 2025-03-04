import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  RABBITMQ_URL: string;
  NATS_URL: string;
  STRIPE_SECRET: string;
  SUCCESS_URL: string;
  CANCEL_URL: string;
  PAYMENT_PORT: number;
}

const envsSchema = joi
  .object({
    RABBITMQ_URL: joi.string().required(),
    NATS_URL: joi.string().required(),
    STRIPE_SECRET: joi.string().required(),
    SUCCESS_URL: joi.string().required(),
    CANCEL_URL: joi.string().required(),
    PAYMENT_PORT: joi.number().port(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  rabbitMQUrl: envVars.RABBITMQ_URL,
  natsUrl: envVars.NATS_URL,
  stripeSecret: envVars.STRIPE_SECRET,
  successUrl: envVars.SUCCESS_URL,
  cancelUrl: envVars.CANCEL_URL,
  paymentPort: envVars.PAYMENT_PORT,
};
