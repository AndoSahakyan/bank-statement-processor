import { StatementModule } from './statement/statement.module';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [StatementModule, MulterModule.register()],
})
export class AppModule {}
