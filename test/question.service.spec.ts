import {Test, TestingModule} from '@nestjs/testing';
import {QuestionService} from '../src/question/services/question.service';
import {AnswerService} from '../src/answer/answer.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {EntityManager, Repository} from 'typeorm';
import {Quiz} from '../src/quiz/entites/quiz.entity';
import {Question} from '../src/question/entities/question.entity';

describe('QuestionService', () => {
    let service: QuestionService;
    let mockAnswerService: AnswerService;
    let mockQuestionRepository: Repository<Question>;

    const mockAnswerServiceV = {
        bulkCreateAnswers: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestionService,
                {
                    provide: AnswerService,
                    useValue: mockAnswerServiceV,
                },
                {
                    provide: getRepositoryToken(Question),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<QuestionService>(QuestionService);
        mockAnswerService = module.get<AnswerService>(AnswerService);
        mockQuestionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    });

    describe('bulkCreateQuestions', () => {
        it('should successfully create questions and answers', async () => {
            const questionsInput = [];
            const quiz = new Quiz();
            const manager = {save: jest.fn()} as unknown as EntityManager;

            (manager.save as jest.Mock).mockResolvedValue(
                questionsInput.map((input, index) => ({
                    id: index,
                    ...input,
                    quiz,
                })),
            );

            jest.spyOn(mockAnswerService, 'bulkCreateAnswers').mockResolvedValue(undefined);

            const result = await service.bulkCreateQuestions(questionsInput, quiz, manager);

            expect(result.ok).toBeTruthy();
            expect(result.questions).toHaveLength(questionsInput.length);
            expect(mockAnswerService.bulkCreateAnswers).toHaveBeenCalledTimes(1);
        });

        it('should handle errors when creating questions', async () => {
            const questionsInput = [];
            const quiz = new Quiz();
            const manager = {save: jest.fn()} as unknown as EntityManager;
            const error = new Error('An error occurred');

            (manager.save as jest.Mock).mockRejectedValue(error);

            const result = await service.bulkCreateQuestions(questionsInput, quiz, manager);

            expect(result.ok).toBeFalsy();
            expect(result.error).toBeDefined();
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
