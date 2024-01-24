import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Quiz} from '../entites/quiz.entity';
import {Repository} from 'typeorm';
import {CreateQuizInput, CreateQuizOutput} from '../dtos/create-quiz.dto';
import {QuestionService} from '../../question/services/question.service';
import {GetQuizOutput} from '../dtos/get-quiz.dto';
import {QuizValidationService} from './quiz-validation.service';
import {TransactionManagerService} from '../../common/services/transaction-manager.service';
import {getErrorMessage} from '../../common/utils/message.utils';
import {CheckQuizInput, CheckQuizOutput} from '../dtos/check-quiz.dto';
import { TypeGatewayService } from '../../question/services/question-gateway.service';

@Injectable()
export class QuizService {
    constructor(
        @InjectRepository(Quiz) private readonly quizes: Repository<Quiz>,
        private readonly questionService: QuestionService,
        private readonly quizValidationService: QuizValidationService,
        private readonly transactionManager: TransactionManagerService,
        private readonly typeGatewayService: TypeGatewayService
    ) {}

    async createQuiz(input: CreateQuizInput): Promise<CreateQuizOutput> {
        const validateQuiz = this.quizValidationService.validate(input);
        if (!validateQuiz.ok) return validateQuiz;

        return this.transactionManager.withTransaction(async manager => {
            const quiz = manager.create(Quiz, {
                title: input.title,
                description: input.description,
            });

            const savedQuiz = await manager.save(quiz);
            await this.questionService.bulkCreateQuestions(input.questions, savedQuiz, manager);

            return {
                ok: true,
            };
        });
    }

    async getQuizByTitle(title: string): Promise<GetQuizOutput> {
        const result = await this.findQuizWithTitleOrFail(title);

        if (!result.ok) {
            return {
                ok: false,
                error: result.error,
            };
        }

        return GetQuizOutput.fromQuiz(result.quiz);
    }

    async evaluateQuizAnswers(input: CheckQuizInput): Promise<CheckQuizOutput> {
        const result = await this.findQuizWithTitleOrFail(input.title);

        let earnedPoints = 0;
        let totalPoints = 0;

        if (!result.ok) {
            return {
                ok: false,
                error: result.error,
                earnedPoints: earnedPoints,
                totalPoints: totalPoints,
            };
        }

        for(const question of result.quiz.questions){
            totalPoints++
            const userAnswers = input.answers.filter(answer => answer.questionNumber === question.number);
            if(userAnswers.length !== 0 && this.typeGatewayService.checkType(question,userAnswers)) {
                earnedPoints++
            }
        }

        return {ok: true, earnedPoints: earnedPoints, totalPoints: totalPoints};
    }

    private async findQuizWithTitleOrFail(
        title: string,
    ): Promise<{ok: boolean; error?: string; quiz?: Quiz}> {
        const quiz = await this.quizes.findOne({
            where: {title},
            relations: ['questions', 'questions.answers'],
        });

        if (!quiz) {
            return {
                ok: false,
                error: getErrorMessage('quizNotFoundWithTitle', {title}),
            };
        }

        return {ok: true, quiz};
    }
}
