import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class GetAnswerOutput {
    @Field(() => String)
    name: string;
}
