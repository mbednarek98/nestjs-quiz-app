import {registerEnumType} from '@nestjs/graphql';
import {CoreValidationService} from '../../common/services/validation.service';
import {CreateQuestionInput, CreateQuestionOutput} from '../dtos/create-question.dto';
import {CheckAnswerInput} from '../../answer/dtos/check-answer.dto';
import {Answer} from '../../answer/entities/answer.entity';

export enum QuestionType {
    SingleCorrect = 'SINGLE_CORRECT',
    MultipleCorrect = 'MULTIPLE_CORRECT',
    Sorting = 'SORTING',
    PlainText = 'PLAIN_TEXT',
}

registerEnumType(QuestionType, {
    name: 'QuestionType',
});

export abstract class TypeGateway extends CoreValidationService {
    abstract validate(questionInput: CreateQuestionInput): CreateQuestionOutput;
    abstract checkAnswers(originalAnswers: Answer[], userAnswers: CheckAnswerInput[]): boolean;
}
