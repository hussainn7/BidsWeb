import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PayoutsService } from './payouts.service';

@Injectable()
export class PayoutsScheduler {
  private readonly logger = new Logger(PayoutsScheduler.name);

  constructor(private payoutsService: PayoutsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handlePayouts() {
    this.logger.log('Running scheduled payout processing...');
    await this.payoutsService.processPayouts();
  }
}


