import {Injectable} from '@nestjs/common';
import {EntityManager} from 'typeorm';
import {CreateAnswerInput, CreateAnswerOutput} from './dtos/create-answer.dto';
import {getErrorMessage} from '../common/utils/message.utils';

@Injectable()
export class AnswerService {
    async bulkCreateAnswers(
        answerInput: CreateAnswerInput[],
        manager: EntityManager,
    ): Promise<CreateAnswerOutput> {
        try {
            return await this.createAnswers(answerInput, manager);
        } catch (error) {
            return {
                ok: false,
                error: getErrorMessage('genericCreatingAnswerError'),
            };
        }
    }

    async createAnswers(
        answerInput: CreateAnswerInput[],
        manager: EntityManager,
    ): Promise<CreateAnswerOutput> {
        const savedAnswers = await manager.save(
            CreateAnswerOutput.createAnswersMap(answerInput, manager),
        );

        return {
            ok: true,
            answers: savedAnswers,
        };
    }
}
