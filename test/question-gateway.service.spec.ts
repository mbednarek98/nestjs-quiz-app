import {Test, TestingModule} from '@nestjs/testing';
import {TypeGatewayService} from '../src/question/services/question-gateway.service';
import {QuestionType, TypeGateway} from '../src/question/gateways/type-gateway.base';
import {CreateQuestionInput, CreateQuestionOutput} from '../src/question/dtos/create-question.dto';
import {getErrorMessage} from '../src/common/utils/message.utils';
import {CoreValidationService} from '../src/common/services/validation.service';
import {Question} from '../src/question/entities/question.entity';
import {Quiz} from '../src/quiz/entites/quiz.entity';

describe('TypeGatewayService', () => {
    let service: TypeGatewayService;
    let mockTypeGatewayProvider: Record<QuestionType, TypeGateway>;
    class MockTypeGateway extends CoreValidationService implements TypeGateway {
        validate = jest.fn();
        checkAnswers = jest.fn();

        // Expose the protected method as a public method for the mock
        public validationFailureExposed = this.validationFailure;
    }

    beforeEach(async () => {
        mockTypeGatewayProvider = {
            [QuestionType.SingleCorrect]: new MockTypeGateway(),
            [QuestionType.MultipleCorrect]: new MockTypeGateway(),
            [QuestionType.Sorting]: new MockTypeGateway(),
            [QuestionType.PlainText]: new MockTypeGateway(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeGatewayService,
                {
                    provide: 'TypeGatewayProvider',
                    useValue: mockTypeGatewayProvider,
                },
            ],
        }).compile();

        service = module.get<TypeGatewayService>(TypeGatewayService);
    });

    describe('validateType', () => {
        it('should validate the question type using the correct gateway', () => {
            const input: CreateQuestionInput = {
                description: '',
                type: QuestionType.SingleCorrect,
                answers: [],
            };
            const output: CreateQuestionOutput = {ok: true};

            (
                mockTypeGatewayProvider[QuestionType.SingleCorrect].validate as jest.Mock
            ).mockReturnValue(output);

            const result = service.validateType(input);

            expect(
                mockTypeGatewayProvider[QuestionType.SingleCorrect].validate,
            ).toHaveBeenCalledWith(input);
            expect(result).toEqual(output);
        });

        it('should return an error if the question type is unknown', () => {
            const input: CreateQuestionInput = {
                description: '',
                answers: [],
                type: 'UnknownType' as QuestionType /* ... */,
            };
            const errorMessage = getErrorMessage('genericUnknownTypeError');
            const result = service.validateType(input);

            expect(result).toEqual({
                ok: false,
                error: errorMessage,
            });
        });
    });
    describe('checkType', () => {
        it('should check the answers using the correct gateway and return true for correct answers', () => {
            const question: Question = {
                quiz: new Quiz(),
                id: 1,
                answers: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                type: QuestionType.SingleCorrect,
                description: 'What is the capital of France?',
                number: 1,
            };
            const userAnswers = [];

            (
                mockTypeGatewayProvider[QuestionType.SingleCorrect].checkAnswers as jest.Mock
            ).mockReturnValue(true);

            const result = service.checkType(question, userAnswers);

            expect(
                mockTypeGatewayProvider[QuestionType.SingleCorrect].checkAnswers,
            ).toHaveBeenCalledWith(question.answers, userAnswers);
            expect(result).toBeTruthy();
        });

        it('should return false if the question type is unknown', () => {
            const question: Question = {
                quiz: new Quiz(),
                id: 1,
                answers: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'UnknownType' as QuestionType,
                description: 'What is the capital of France?',
                number: 1,
            };
            const userAnswers = [];

            const result = service.checkType(question, userAnswers);

            expect(result).toBeFalsy();
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
