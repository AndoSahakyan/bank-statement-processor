import { Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { StatementService } from './statement.service';
import { ReportDTO } from './dto/report.dto';

@ApiTags('Statements')
@Controller('statements')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @Post('validate-csv')
  @ApiResponse({ type: [ReportDTO] })
  async validateCSV(): Promise<ReportDTO[]> {
    return this.statementService.validateCSV();
  }

  @Post('validate-xml')
  @ApiResponse({ type: [ReportDTO] })
  async validateXML(): Promise<ReportDTO[]> {
    return this.statementService.validateXML();
  }
}
