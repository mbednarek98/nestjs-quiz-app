import {QuizConsts} from '../../config';
import {CreateQuestionInput, CreateQuestionOutput} from '../dtos/create-question.dto';
import {TypeGateway} from './type-gateway.base';
import {getErrorMessage} from '../../common/utils/message.utils';
import {CheckAnswerInput} from '../../answer/dtos/check-answer.dto';
import {Answer} from '../../answer/entities/answer.entity';

export class PlainTextGateway extends TypeGateway {
    validate(questionInput: CreateQuestionInput): CreateQuestionOutput {
        const correctAnswers = questionInput.answers.filter(a => a.is_correct);

        if (correctAnswers.length === 1 && questionInput.answers.length === 1) return {ok: true};
        return this.validationFailure(
            getErrorMessage('plainTextQuestionRules', {
                value: QuizConsts.ANSWERS_PLAIN_TEXT_QUESTION,
            }),
        );
    }
    checkAnswers(originalAnswers: Answer[], userAnswers: CheckAnswerInput[]): boolean {
        if (userAnswers.length !== 1) return false;
        const correctAnswer = originalAnswers.find(a => a.is_correct);
        return (
            correctAnswer && this.comparePlainTextAnswers(correctAnswer.name, userAnswers[0].name)
        );
    }

    private comparePlainTextAnswers(correctAnswer: string, userAnswer: string): boolean {
        if (userAnswer.length > correctAnswer.length + QuizConsts.STRING_LENGHT_TOLERANCE) {
            return false;
        }

        const normalize = (str: string) =>
            str
                .toLowerCase()
                .replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                .replace(/\s/g, '')
                .trim();

        const normalizedCorrectAnswer = normalize(correctAnswer);
        const normalizedUserAnswer = normalize(userAnswer);

        return normalizedCorrectAnswer === normalizedUserAnswer;
    }
}
