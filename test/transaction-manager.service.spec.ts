import {Test, TestingModule} from '@nestjs/testing';
import {DataSource, EntityManager} from 'typeorm';
import {TransactionManagerService} from '../src/common/services/transaction-manager.service';

describe('TransactionManagerService', () => {
    let service: TransactionManagerService;
    let dataSource: DataSource;
    let queryRunner: any;

    beforeEach(async () => {
        const dataSourceMock = {
            createQueryRunner: jest.fn(() => queryRunner),
        };

        queryRunner = {
            manager: new EntityManager(dataSourceMock as any),
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionManagerService,
                {
                    provide: DataSource,
                    useValue: dataSourceMock,
                },
            ],
        }).compile();

        service = module.get<TransactionManagerService>(TransactionManagerService);
        dataSource = module.get<DataSource>(DataSource);
    });

    it('should commit transaction if work function returns ok: true', async () => {
        const work = jest.fn().mockResolvedValue({ok: true, result: 'Success'});
        await service.withTransaction(work);

        expect(queryRunner.startTransaction).toHaveBeenCalled();
        expect(work).toHaveBeenCalledWith(queryRunner.manager);
        expect(queryRunner.commitTransaction).toHaveBeenCalled();
        expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction if work function returns ok: false', async () => {
        const work = jest.fn().mockResolvedValue({ok: false, error: 'Error'});
        await service.withTransaction(work);

        expect(queryRunner.startTransaction).toHaveBeenCalled();
        expect(work).toHaveBeenCalledWith(queryRunner.manager);
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction and handle error if work function throws', async () => {
        const error = {code: '23505', detail: 'Key (id)=(3) already exists.'};
        const work = jest.fn().mockRejectedValue(error);
        const result = await service.withTransaction(work);

        expect(queryRunner.startTransaction).toHaveBeenCalled();
        expect(work).toHaveBeenCalledWith(queryRunner.manager);
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
        expect(result).toEqual({ok: false, error: expect.any(String)});
    });

    it('should handle unique constraint violation correctly', async () => {
        const error = {code: '23505', detail: 'Key (id)=(3) already exists.'};
        const work = jest.fn().mockRejectedValue(error);
        const result = await service.withTransaction(work);

        expect(result).toEqual({ok: false, error: expect.stringContaining('already exists')});
    });

    it('should handle generic database errors correctly', async () => {
        const error = new Error('Generic error');
        const work = jest.fn().mockRejectedValue(error);
        const result = await service.withTransaction(work);

        expect(result).toEqual({
            ok: false,
            error: expect.stringContaining('Internal server error.'),
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
