import {Field, InputType, Int, ObjectType} from '@nestjs/graphql';
import {IsString, Length, MaxLength} from 'class-validator';
import {CoreEntity} from '../../common/entites/core.entity';
import {Column, Entity, OneToMany} from 'typeorm';
import {Question} from '../../question/entities/question.entity';

@InputType('QuizInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Quiz extends CoreEntity {
    @Field(type => String)
    @Column({unique: true, nullable: false})
    @IsString()
    @Length(4, 50)
    title: string;

    @Field(type => String, {nullable: true})
    @Column({nullable: false, default: ''})
    @IsString()
    @MaxLength(1000)
    description: string;

    @Field(type => [Question])
    @OneToMany(type => Question, question => question.quiz)
    questions: Question[];
}
