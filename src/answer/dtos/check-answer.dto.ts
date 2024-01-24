import {Field, InputType, Int, PickType} from '@nestjs/graphql';
import {Answer} from '../entities/answer.entity';

@InputType()
export class CheckAnswerInput extends PickType(Answer, ['order']) {
    @Field(() => String, {defaultValue: ''})
    name?: string;

    @Field(() => Int, {nullable: true})
    questionNumber?: number;
}
