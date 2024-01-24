import {Test, TestingModule} from '@nestjs/testing';
import {QuestionType, TypeGateway} from '../src/question/gateways';
import {QuestionValidationService} from '../src/question/services/question-validation.service';
import {TypeGatewayService} from '../src/question/services/question-gateway.service';
import {CreateQuestionInput, CreateQuestionOutput} from '../src/question/dtos/create-question.dto';
import {QuizConsts} from '../src/config';
import {Question} from '../src/question/entities/question.entity';

const mockTypeGatewayService = {
    validateType: jest
        .fn()
        .mockImplementation((questionInput: CreateQuestionInput): CreateQuestionOutput => {
            return {ok: true};
        }),
};

const validQuestionInput: CreateQuestionInput = {
    description: 'What is the capital of France?',
    type: QuestionType.SingleCorrect,
    answers: [{name: 'Paris', is_correct: true, order: 0, question: new Question()}],
};

describe('QuestionValidationService', () => {
    let service: QuestionValidationService;
    let typeGatewayService: TypeGatewayService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestionValidationService,
                {
                    provide: TypeGatewayService,
                    useValue: mockTypeGatewayService,
                },
            ],
        }).compile();

        service = module.get<QuestionValidationService>(QuestionValidationService);
        typeGatewayService = module.get<TypeGatewayService>(TypeGatewayService);
    });

    it('should validate a question with non-empty answers', () => {
        const result = service.validate(validQuestionInput);
        expect(result).toEqual({ok: true});
    });

    it('should fail validation if answers are empty', () => {
        const result = service.validate({...validQuestionInput, answers: []});
        expect(result).toEqual({
            ok: false,
            error: expect.stringContaining('Each question must include at least 1 answer.'),
        });
    });

    it('should fail validation if answers exceed the maximum range', () => {
        const tooManyAnswers = new Array(QuizConsts.MAX_ANSWERS_PER_QUESTION + 1).fill({});
        const result = service.validate({...validQuestionInput, answers: tooManyAnswers});
        expect(result).toEqual({
            ok: false,
            error: expect.stringContaining('Each question should not have more than 10 answers.'),
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
