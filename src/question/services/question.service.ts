import {Injectable} from '@nestjs/common';
import {EntityManager} from 'typeorm';
import {AnswerService} from '../../answer/answer.service';
import {Quiz} from '../../quiz/entites/quiz.entity';
import {CreateQuestionInput, CreateQuestionOutput} from '../dtos/create-question.dto';
import {CreateAnswerInput} from '../../answer/dtos/create-answer.dto';
import {getErrorMessage} from '../../common/utils/message.utils';

@Injectable()
export class QuestionService {
    constructor(private readonly answerService: AnswerService) {}

    async bulkCreateQuestions(
        questionsInput: CreateQuestionInput[],
        quiz: Quiz,
        manager: EntityManager,
    ): Promise<CreateQuestionOutput> {
        try {
            const questions = CreateQuestionOutput.mapQuestions(questionsInput, quiz, manager);

            const savedQuestions = await manager.save(questions);

            let agregatedAnswers = CreateAnswerInput.aggregateAnswersForBulkInsert(
                savedQuestions,
                questionsInput,
            );

            await this.answerService.bulkCreateAnswers(agregatedAnswers, manager);

            return {
                ok: true,
                questions: savedQuestions,
            };
        } catch (error) {
            return {
                ok: false,
                error: getErrorMessage('genericCreatingQuestionError'),
            };
        }
    }
}
