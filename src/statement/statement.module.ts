import { Module } from '@nestjs/common';

import { StatementController } from './statement.controller';
import { StatementService } from './statement.service';

@Module({
  imports: [],
  controllers: [StatementController],
  providers: [StatementService],
})
export class StatementModule {}
