import {Field, InputType, ObjectType, PickType} from '@nestjs/graphql';
import {CoreOutput} from '../../common/dtos/output.dto';
import {Question} from '../entities/question.entity';
import {CreateAnswerInput} from '../../answer/dtos/create-answer.dto';
import {EntityManager} from 'typeorm';
import {Quiz} from '../../quiz/entites/quiz.entity';

@InputType()
export class CreateQuestionInput extends PickType(Question, ['description', 'type']) {
    @Field(type => [CreateAnswerInput])
    answers: CreateAnswerInput[];
}

@ObjectType()
export class CreateQuestionOutput extends CoreOutput {
    @Field(type => Question, {nullable: true})
    questions?: Question[];

    static mapQuestions(
        questionsInput: CreateQuestionInput[],
        quiz: Quiz,
        manager: EntityManager,
    ): Question[] {
        return questionsInput.map((input, index) => {
            return manager.create(Question, {
                number: index + 1,
                description: input.description,
                type: input.type,
                quiz: quiz,
            });
        });
    }
}
