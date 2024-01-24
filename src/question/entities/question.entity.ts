import {Field, InputType, Int, ObjectType} from '@nestjs/graphql';
import {IsNumber, IsString, Length, MaxLength} from 'class-validator';
import {CoreEntity} from '../../common/entites/core.entity';
import {Column, Entity, ManyToOne, OneToMany, RelationId} from 'typeorm';
import {Quiz} from '../../quiz/entites/quiz.entity';
import {Answer} from '../../answer/entities/answer.entity';
import {QuestionType} from '../question.enum';

@InputType('QuestionInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Question extends CoreEntity {
    @Field(type => Int)
    @Column({nullable: false})
    @IsNumber()
    @Length(1)
    number: number;

    @Field(type => String)
    @Column({nullable: false})
    @IsString()
    @Length(4, 1000)
    description: string;

    @Field(() => QuestionType)
    @Column({
        type: 'enum',
        enum: QuestionType,
        nullable: false,
    })
    type: QuestionType;

    @Field(type => Quiz)
    @ManyToOne(() => Quiz, quiz => quiz.questions)
    quiz: Quiz;

    @Field(type => [Answer])
    @OneToMany(type => Answer, answer => answer.question)
    answers: Answer[];
}
