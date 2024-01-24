import {Field} from '@nestjs/graphql';

export abstract class CoreOutput {
    @Field(type => String, {nullable: true})
    error?: string;

    @Field(type => Boolean)
    ok: boolean;
}
