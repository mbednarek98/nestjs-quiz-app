import {Injectable} from '@nestjs/common';
import {CreateQuizInput, CreateQuizOutput} from '../dtos/create-quiz.dto';
import {QuestionValidationService} from '../../question/services/question-validation.service';
import {TypeGatewayService} from '../../question/services/question-gateway.service';
import {CoreValidationService} from '../../common/services/validation.service';
import {getErrorMessage} from '../../common/utils/message.utils';
import {QuizConsts} from '../../config';

@Injectable()
export class QuizValidationService extends CoreValidationService {
    constructor(
        private readonly questionValidationService: QuestionValidationService,
        private readonly typeGatewayService: TypeGatewayService,
    ) {
        super();
    }

    validate(input: CreateQuizInput): CreateQuizOutput {
        if (!input.questions || input.questions.length === 0) {
            return this.validationFailure(
                getErrorMessage('quizMinQuestionsRequired', {min_value: QuizConsts.MIN_QUESTIONS}),
            );
        }

        if (input.questions.length > QuizConsts.MAX_QUESTIONS) {
            return this.validationFailure(
                getErrorMessage('quizMaxQuestionsLimit', {max_value: QuizConsts.MAX_QUESTIONS}),
            );
        }

        for (const question of input.questions) {
            const questionValidation = this.questionValidationService.validate(question);
            if (!questionValidation.ok) return questionValidation;

            const questionTypeValidation = this.typeGatewayService.validateType(question);
            if (!questionTypeValidation.ok) return questionTypeValidation;
        }

        return {ok: true};
    }
}
