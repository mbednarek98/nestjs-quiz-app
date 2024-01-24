import {Field, Int, ObjectType} from '@nestjs/graphql';
import {GetAnswerOutput} from '../../answer/dtos/get-answer.dto';
import {QuestionType} from '../gateways';

@ObjectType()
export class GetQuestionOutput {
    @Field(() => Int)
    number: Number;

    @Field(() => String)
    description: string;

    @Field(() => QuestionType)
    type: QuestionType;

    @Field(() => [GetAnswerOutput])
    answers: GetAnswerOutput[];
}
