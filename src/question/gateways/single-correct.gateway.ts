import {QuizConsts} from '../../config';
import {CreateQuestionInput, CreateQuestionOutput} from '../dtos/create-question.dto';
import {TypeGateway} from './type-gateway.base';
import {getErrorMessage} from '../../common/utils/message.utils';
import {CheckAnswerInput} from '../../answer/dtos/check-answer.dto';
import {Answer} from '../../answer/entities/answer.entity';

export class SingleCorrectGateway extends TypeGateway {
    validate(questionInput: CreateQuestionInput): CreateQuestionOutput {
        const correctAnswers = questionInput.answers.filter(a => a.is_correct);

        if (
            correctAnswers.length === 1 &&
            questionInput.answers.length >= QuizConsts.MIN_ANSWERS_SINGLE_CORRECT
        )
            return {ok: true};
        return this.validationFailure(
            getErrorMessage('singleCorrectAnswerQuestionRules', {
                correct_value: QuizConsts.MIN_CORRECT_ANSWERS_SINGLE_CORRECT,
                min_value: QuizConsts.MIN_ANSWERS_SINGLE_CORRECT,
            }),
        );
    }
    checkAnswers(originalAnswers: Answer[], userAnswers: CheckAnswerInput[]): boolean {
        if (userAnswers.length !== 1) return false;
        const correctAnswer = originalAnswers.find(a => a.is_correct);
        return correctAnswer && correctAnswer.name === userAnswers[0].name;
    }
}
