import {Injectable} from '@nestjs/common';
import {TypeGatewayService} from './question-gateway.service';
import {CreateQuestionInput, CreateQuestionOutput} from '../dtos/create-question.dto';
import {CoreValidationService} from '../../common/services/validation.service';
import {getErrorMessage} from '../../common/utils/message.utils';
import {QuizConsts} from '../../config';

@Injectable()
export class QuestionValidationService extends CoreValidationService {
    constructor(private readonly typeGatewayService: TypeGatewayService) {
        super();
    }

    validate(questionInput: CreateQuestionInput): CreateQuestionOutput {
        if (this.isAnswersEmpty(questionInput)) {
            return this.validationFailure(
                getErrorMessage('questionMinAnswersRequired', {
                    min_value: QuizConsts.MIN_ANSWERS_PER_QUESTION,
                }),
            );
        }

        if (this.isAnswersOutOfRange(questionInput)) {
            return this.validationFailure(
                getErrorMessage('questionMaxAnswersLimit', {
                    max_value: QuizConsts.MAX_ANSWERS_PER_QUESTION,
                }),
            );
        }

        return this.typeGatewayService.validateType(questionInput);
    }

    isAnswersEmpty({answers}: CreateQuestionInput): boolean {
        return !answers || answers.length === 0;
    }

    isAnswersOutOfRange({answers}: CreateQuestionInput): boolean {
        return answers.length > QuizConsts.MAX_ANSWERS_PER_QUESTION;
    }
}
