import {Field, InputType, Int, ObjectType, PickType} from '@nestjs/graphql';
import {Quiz} from '../entites/quiz.entity';
import {CoreOutput} from '../../common/dtos/output.dto';
import {CreateQuestionInput} from '../../question/dtos/create-question.dto';

@InputType()
export class CreateQuizInput extends PickType(Quiz, ['title', 'description']) {
    @Field(type => [CreateQuestionInput])
    questions: CreateQuestionInput[];
}

@ObjectType()
export class CreateQuizOutput extends CoreOutput {
    @Field(type => String, {nullable: true})
    error?: string;

    @Field(type => Boolean)
    ok: boolean;
}
