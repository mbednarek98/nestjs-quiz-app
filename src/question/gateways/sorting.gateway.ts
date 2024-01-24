import {QuizConsts} from '../../config';
import {CreateQuestionInput, CreateQuestionOutput} from '../dtos/create-question.dto';
import {TypeGateway} from './type-gateway.base';
import {getErrorMessage} from '../../common/utils/message.utils';
import {CheckAnswerInput} from '../../answer/dtos/check-answer.dto';
import {Answer} from '../../answer/entities/answer.entity';

export class SortingGateway extends TypeGateway {
    validate(questionInput: CreateQuestionInput): CreateQuestionOutput {
        if (questionInput.answers.length < 2) {
            return this.validationFailure(
                getErrorMessage('sortingQuestionMinAnswers', {
                    min_value: QuizConsts.MIN_ANSWERS_SORTING_QUESTION,
                }),
            );
        }

        const orders = questionInput.answers.map(a => a.order);
        const uniqueOrders = new Set(orders);
        const correctOrder = orders.every(
            order =>
                order >= QuizConsts.MIN_ANSWERS_PER_QUESTION &&
                order <= QuizConsts.MAX_ANSWERS_PER_QUESTION,
        );

        if (orders.length === uniqueOrders.size && correctOrder) return {ok: true};
        return this.validationFailure(getErrorMessage('sortingQuestionDistinctOrderNumbers'));
    }
    checkAnswers(originalAnswers: Answer[], userAnswers: CheckAnswerInput[]): boolean {
        if (originalAnswers.length !== userAnswers.length) return false;

        const userAnswerOrders = new Set(userAnswers.map(answer => answer.order));
        if (userAnswerOrders.size !== originalAnswers.length) return false;

        const sortedOriginalAnswers = [...originalAnswers].sort((a, b) => a.order - b.order);
        const sortedUserAnswers = [...userAnswers].sort((a, b) => a.order - b.order);

        for (let i = 0; i < sortedOriginalAnswers.length; i++) {
            if (sortedOriginalAnswers[i].name !== sortedUserAnswers[i].name) {
                return false;
            }
        }
        return true;
    }
}
