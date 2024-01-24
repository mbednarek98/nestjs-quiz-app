import {QuizConsts} from '../../config';
import {CreateQuestionInput, CreateQuestionOutput} from '../dtos/create-question.dto';
import {TypeGateway} from './type-gateway.base';
import {getErrorMessage} from '../../common/utils/message.utils';
import {CheckAnswerInput} from '../../answer/dtos/check-answer.dto';
import {Answer} from '../../answer/entities/answer.entity';

export class MultipleCorrectGateway extends TypeGateway {
    validate(questionInput: CreateQuestionInput): CreateQuestionOutput {
        const correctAnswers = questionInput.answers.filter(a => a.is_correct);

        if (correctAnswers.length >= 2 && questionInput.answers.length >= 3) return {ok: true};
        return this.validationFailure(
            getErrorMessage('multipleCorrectAnswersQuestionRules', {
                correct_value: QuizConsts.MIN_CORRECT_ANSWERS_MULTIPLE_CORRECT,
                min_value: QuizConsts.MIN_TOTAL_ANSWERS_MULTIPLE_CORRECT,
            }),
        );
    }
    checkAnswers(originalAnswers: Answer[], userAnswers: CheckAnswerInput[]): boolean {
        const correctAnswersSet = new Set(
            originalAnswers.filter(a => a.is_correct).map(a => a.name),
        );
        for (const answer of userAnswers) {
            if (!correctAnswersSet.has(answer.name)) {
                return false;
            }
            correctAnswersSet.delete(answer.name);
        }
        return correctAnswersSet.size === 0;
    }
}
