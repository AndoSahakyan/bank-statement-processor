import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import { XMLParser } from 'fast-xml-parser';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import BigNumber from 'bignumber.js';

import { StatementDTO } from './dto/statement.dto';
import { ReportDTO } from './dto/report.dto';

@Injectable()
export class StatementService {
  validateCSV(): Promise<ReportDTO[]> {
    const fileStream = createReadStream(
      join(process.cwd(), 'static/records.csv'),
    );

    const records: StatementDTO[] = [];

    return new Promise((resolve) => {
      fileStream
        .pipe(
          csvParser({
            headers: [
              'transactionReference',
              'accountNumber',
              'description',
              'startBalance',
              'mutation',
              'endBalance',
            ],
          }),
        )
        .on('data', (data) => {
          records.push(data);
        })
        .on('end', () => {
          const report = this.validateRecords(records.slice(1));
          resolve(report);
        });
    });
  }

  validateXML(): Promise<ReportDTO[]> {
    return new Promise((resolve) => {
      const parser = new XMLParser({
        ignoreAttributes: false,
      });
      const file = readFileSync(join(process.cwd(), 'static/records.xml'), {
        encoding: 'utf-8',
      });
      const parsedRecords = parser.parse(file);
      const report = this.validateRecords(
        parsedRecords.records.record.map((record) => ({
          ...record,
          transactionReference: record['@_reference'],
        })),
      );
      resolve(report);
    });
  }

  private validateRecords(records: StatementDTO[]): ReportDTO[] {
    const uniqueTransactionReferences = new Set<number>();
    const failedRecords: ReportDTO[] = [];

    for (const record of records) {
      const reasons = [];
      const { transactionReference } = record;

      if (uniqueTransactionReferences.has(transactionReference)) {
        reasons.push('Duplicate transaction reference');
      } else {
        uniqueTransactionReferences.add(transactionReference);
      }

      const { startBalance, mutation, endBalance } = record;
      const mutationStr = String(mutation);
      const result = new BigNumber(startBalance).plus(mutation);

      if (!['+', '-'].includes(mutationStr.charAt(0))) {
        reasons.push('Invalid mutation');
      }

      if (!result.isEqualTo(endBalance)) {
        reasons.push('Invalid end balance');
      }

      if (reasons.length) {
        failedRecords.push({
          transactionReference,
          reasons,
        });
      }
    }

    return failedRecords;
  }
}
