import { ApiProperty } from '@nestjs/swagger';

export class ReportDTO {
  @ApiProperty()
  transactionReference: number;

  @ApiProperty()
  reasons: string[];
}
