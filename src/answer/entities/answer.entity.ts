import {Field, InputType, Int, ObjectType} from '@nestjs/graphql';
import {
    IsBoolean,
    IsNumber,
    IsString,
    Length,
} from 'class-validator';
import {CoreEntity} from '../../common/entites/core.entity';
import {Column, Entity, ManyToOne} from 'typeorm';
import {Question} from '../../question/entities/question.entity';

@InputType('AnswerInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Answer extends CoreEntity {
    @Field(type => String)
    @Column({nullable: false})
    @IsString()
    @Length(4, 255)
    name: string;

    @Field(type => Boolean, {nullable: true})
    @Column({nullable: false, default: false})
    @IsBoolean()
    is_correct: boolean;

    @Field(type => Int, {nullable: true})
    @Column({nullable: false, default: 0})
    @IsNumber()
    order: number;

    @Field(type => Question)
    @ManyToOne(() => Question, question => question.answers)
    question: Question;
}
