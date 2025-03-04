import { Provider } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { envs } from 'src/config';
import { NATS_CLIENT } from '../constants';

export const natsProvider: Provider = {
  provide: NATS_CLIENT,
  useFactory: () => {
    const config: ClientOptions = {
      transport: Transport.NATS,
      options: {
        servers: [envs.natsUrl],
      },
    };
    return ClientProxyFactory.create(config);
  },
};
