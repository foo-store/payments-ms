import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { natsProvider } from 'src/common/providers';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, natsProvider],
})
export class PaymentsModule {}
