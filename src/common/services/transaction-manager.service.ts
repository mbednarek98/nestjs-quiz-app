import {Injectable} from '@nestjs/common';
import {DataSource, EntityManager} from 'typeorm';
import {getErrorMessage} from '../utils/message.utils';

@Injectable()
export class TransactionManagerService {
    constructor(private readonly dataSource: DataSource) {}

    async withTransaction<T>(
        work: (manager: EntityManager) => Promise<{
            ok: boolean;
            result?: T;
            error?: string;
        }>,
    ): Promise<{ok: boolean; result?: T; error?: string}> {
        const queryRunner = this.dataSource.createQueryRunner();
        let isConnected = false;

        try {
            await queryRunner.connect();
            isConnected = true;
            await queryRunner.startTransaction();

            const {ok, result, error} = await work(queryRunner.manager);
            if (ok) {
                await queryRunner.commitTransaction();
                return {ok, result};
            } else {
                await queryRunner.rollbackTransaction();
                return {ok, error};
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const dbError = this.handleUniqueError(error);
            return {ok: false, error: dbError};
        } finally {
            if (isConnected) await queryRunner.release();
        }
    }

    private handleUniqueError(error: any): string {
        if (error.code === '23505') {
            const detailMatch = /Key \(([^)]+)\)=\(([^)]+)\)/.exec(error.detail);

            if (detailMatch && detailMatch.length >= 3) {
                const columnName = detailMatch[1];
                const columnValue = detailMatch[2];

                return getErrorMessage('uniqueConstraintViolation', {
                    column: columnName,
                    value: columnValue,
                });
            }
            return getErrorMessage('genericUniqueConstraintViolation');
        }
        return getErrorMessage('internalServerError');
    }
}
