import {Test, TestingModule} from '@nestjs/testing';
import {QuizService} from '../src/quiz/services/quiz.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Quiz} from '../src/quiz/entites/quiz.entity';
import {Repository} from 'typeorm';
import {QuestionService} from '../src/question/services/question.service';
import {QuizValidationService} from '../src/quiz/services/quiz-validation.service';
import {TransactionManagerService} from '../src/common/services/transaction-manager.service';
import {TypeGatewayService} from '../src/question/services/question-gateway.service';
import {GetQuizOutput} from '../src/quiz/dtos/get-quiz.dto';
import {getErrorMessage} from '../src/common/utils/message.utils';
import {CheckQuizInput, CheckQuizOutput} from 'src/quiz/dtos/check-quiz.dto';
import {QuestionType} from 'src/question/gateways';
import {Question} from 'src/question/entities/question.entity';

describe('QuizService', () => {
    let quizService: QuizService;
    let quizRepository: Repository<Quiz>;

    const mockQuizRepository = () => ({
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
    });

    const mockQuestionService = {
        bulkCreateQuestions: jest.fn(),
    };

    const mockQuizValidationService = {
        validate: jest.fn(),
    };

    const mockTransactionManagerService = {
        withTransaction: jest.fn(),
    };

    const mockTypeGatewayService = {
        checkType: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizService,
                {
                    provide: getRepositoryToken(Quiz),
                    useValue: mockQuizRepository,
                },
                {
                    provide: QuestionService,
                    useValue: mockQuestionService,
                },
                {
                    provide: QuizValidationService,
                    useValue: mockQuizValidationService,
                },
                {
                    provide: TransactionManagerService,
                    useValue: mockTransactionManagerService,
                },
                {
                    provide: TypeGatewayService,
                    useValue: mockTypeGatewayService,
                },
            ],
        }).compile();

        quizService = module.get<QuizService>(QuizService);
        quizRepository = module.get<Repository<Quiz>>(getRepositoryToken(Quiz));
        quizRepository.findOne = jest.fn();
    });

    describe('createQuiz', () => {
        it('should validate and create a new quiz', async () => {
            const input = {title: 'Test Quiz', description: 'A quiz for testing', questions: []};
            const quiz = {id: 1, title: 'Test Quiz', description: 'A quiz for testing'};

            mockQuizValidationService.validate.mockReturnValue({ok: true});
            mockTransactionManagerService.withTransaction.mockImplementation(
                async transactionCode => {
                    return transactionCode({create: () => quiz, save: () => quiz});
                },
            );

            const result = await quizService.createQuiz(input);

            expect(mockQuizValidationService.validate).toHaveBeenCalledWith(input);
            expect(mockTransactionManagerService.withTransaction).toHaveBeenCalled();
            expect(result).toEqual({ok: true});
        });
    });

    describe('getQuizByTitle', () => {
        it('should return a quiz if found by title', async () => {
            const quizTitle = 'Existing Quiz';
            const expectedQuiz = new Quiz();
            expectedQuiz.title = quizTitle;
            expectedQuiz.description = 'Description of existing quiz';
            expectedQuiz.questions = [];

            (quizRepository.findOne as jest.Mock).mockResolvedValue(expectedQuiz);

            const result = await quizService.getQuizByTitle(quizTitle);

            expect(quizRepository.findOne).toHaveBeenCalledWith({
                where: {title: quizTitle},
                relations: ['questions', 'questions.answers'],
            });
            expect(result).toEqual(GetQuizOutput.fromQuiz(expectedQuiz));
        });

        it('should return an error if no quiz is found', async () => {
            const quizTitle = 'Non-existing Quiz';
            (quizRepository.findOne as jest.Mock).mockResolvedValue(undefined);

            const result = await quizService.getQuizByTitle(quizTitle);

            expect(quizRepository.findOne).toHaveBeenCalledWith({
                where: {title: quizTitle},
                relations: ['questions', 'questions.answers'],
            });
            expect(result.ok).toBeFalsy();
            expect(result.error).toEqual(
                getErrorMessage('quizNotFoundWithTitle', {title: quizTitle}),
            );
        });
    });

    describe('evaluateQuizAnswers', () => {
        it('should return a quiz if found by title', async () => {
            const quizTitle = 'Existing Quiz';
            const expectedQuiz = new Quiz();
            expectedQuiz.title = quizTitle;
            expectedQuiz.description = 'Description of existing quiz';
            expectedQuiz.questions = [];

            (quizRepository.findOne as jest.Mock).mockResolvedValue(expectedQuiz);

            const result = await quizService.getQuizByTitle(quizTitle);

            expect(quizRepository.findOne).toHaveBeenCalledWith({
                where: {title: quizTitle},
                relations: ['questions', 'questions.answers'],
            });
            expect(result).toEqual(GetQuizOutput.fromQuiz(expectedQuiz));
        });

        it('should return an error if no quiz is found', async () => {
            const quizTitle = 'Non-existing Quiz';
            (quizRepository.findOne as jest.Mock).mockResolvedValue(undefined);

            const result = await quizService.getQuizByTitle(quizTitle);

            expect(quizRepository.findOne).toHaveBeenCalledWith({
                where: {title: quizTitle},
                relations: ['questions', 'questions.answers'],
            });
            expect(result.ok).toBeFalsy();
            expect(result.error).toEqual(
                getErrorMessage('quizNotFoundWithTitle', {title: quizTitle}),
            );
        });
    });

    describe('evaluateQuizAnswers', () => {
        it('should calculate earned and total points correctly for a valid quiz', async () => {
            const quizTitle = 'Test Quiz';
            const input: CheckQuizInput = {
                title: quizTitle,
                answers: [
                    {questionNumber: 1, name: 'A', order: 0},
                    {questionNumber: 2, name: 'B', order: 0},
                ],
            };
            const questionsMock = [
                {number: 1, type: 'single-correct', answers: []},
                {number: 2, type: 'multiple-correct', answers: []},
            ];

            const quizMock = {title: quizTitle, questions: questionsMock};
            const expectedOutput: CheckQuizOutput = {
                ok: true,
                earnedPoints: 2,
                totalPoints: questionsMock.length,
            };

            (quizRepository.findOne as jest.Mock).mockResolvedValue(quizMock);

            mockTypeGatewayService.checkType.mockReturnValue(true);

            const result = await quizService.evaluateQuizAnswers(input);

            expect(quizRepository.findOne).toHaveBeenCalledWith({
                where: {title: quizTitle},
                relations: ['questions', 'questions.answers'],
            });
            expect(mockTypeGatewayService.checkType).toHaveBeenCalledTimes(input.answers.length);
            expect(result).toEqual(expectedOutput);
        });

        it('should return an error if the quiz is not found', async () => {
            const quizTitle = 'Non-Existing Quiz';
            const input: CheckQuizInput = {
                title: quizTitle,
                answers: [{questionNumber: 1, name: 'A', order: 0}],
            };
            const expectedError = getErrorMessage('quizNotFoundWithTitle', {title: quizTitle});

            (quizRepository.findOne as jest.Mock).mockResolvedValue(undefined);

            const result = await quizService.evaluateQuizAnswers(input);

            expect(quizRepository.findOne).toHaveBeenCalledWith({
                where: {title: quizTitle},
                relations: ['questions', 'questions.answers'],
            });
            expect(result).toEqual({
                ok: false,
                error: expectedError,
                earnedPoints: 0,
                totalPoints: 0,
            });
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
