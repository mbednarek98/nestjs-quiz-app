import {Field, InputType, Int, ObjectType, PickType} from '@nestjs/graphql';
import {Quiz} from '../entites/quiz.entity';
import {CoreOutput} from '../../common/dtos/output.dto';
import {CheckAnswerInput} from '../../answer/dtos/check-answer.dto';

@InputType()
export class CheckQuizInput extends PickType(Quiz, ['title']) {
    @Field(type => [CheckAnswerInput])
    answers: CheckAnswerInput[];
}

@ObjectType()
export class CheckQuizOutput extends CoreOutput {
    @Field(() => Int, {nullable: false})
    earnedPoints: number;

    @Field(() => Int, {nullable: false})
    totalPoints: number;
}
