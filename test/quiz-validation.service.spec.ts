import {Test, TestingModule} from '@nestjs/testing';
import {QuizValidationService} from '../src/quiz/services/quiz-validation.service';
import {QuestionValidationService} from '../src/question/services/question-validation.service';
import {TypeGatewayService} from '../src/question/services/question-gateway.service';
import {CreateQuizInput} from '../src/quiz/dtos/create-quiz.dto';
import {QuizConsts} from '../src/static/quiz.consts';
import {CreateQuestionInput} from '../src/question/dtos/create-question.dto';

describe('QuizValidationService', () => {
    let service: QuizValidationService;

    const mockQuestionValidationService = {
        validate: jest.fn(),
    };

    const mockTypeGatewayService = {
        validateType: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizValidationService,
                {
                    provide: QuestionValidationService,
                    useValue: mockQuestionValidationService,
                },
                {
                    provide: TypeGatewayService,
                    useValue: mockTypeGatewayService,
                },
            ],
        }).compile();

        service = module.get<QuizValidationService>(QuizValidationService);
    });

    it('should return an error if no questions are provided', () => {
        const input = new CreateQuizInput();
        input.questions = [];

        const result = service.validate(input);

        expect(result.ok).toBe(false);
        expect(result.error).toBeDefined();
    });

    it('should return an error if too many questions are provided', () => {
        const input = new CreateQuizInput();
        input.questions = new Array(QuizConsts.MAX_QUESTIONS + 1).fill({});

        const result = service.validate(input);

        expect(result.ok).toBe(false);
        expect(result.error).toBeDefined();
    });

    it('should validate each question', () => {
        const input = new CreateQuizInput();
        input.questions = [new CreateQuestionInput(), new CreateQuestionInput()];

        mockQuestionValidationService.validate.mockReturnValue({ok: true});
        mockTypeGatewayService.validateType.mockReturnValue({ok: true});

        service.validate(input);

        expect(mockQuestionValidationService.validate).toHaveBeenCalledTimes(
            input.questions.length,
        );
        expect(mockTypeGatewayService.validateType).toHaveBeenCalledTimes(input.questions.length);
    });

    it('should return an error if any question validation fails', () => {
        const input = new CreateQuizInput();
        input.questions = [new CreateQuestionInput(), new CreateQuestionInput()];

        mockQuestionValidationService.validate
            .mockReturnValueOnce({ok: true})
            .mockReturnValueOnce({ok: false, error: 'error'});

        const result = service.validate(input);

        expect(result.ok).toBe(false);
        expect(result.error).toBe('error');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
