import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  RABBITMQ_URL: string;
}

const envsSchema = joi
  .object({
    RABBITMQ_URL: joi.string().required(),
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
};
