import {Field, InputType, ObjectType, PickType} from '@nestjs/graphql';
import {CoreOutput} from '../../common/dtos/output.dto';
import {Quiz} from '../entites/quiz.entity';
import {GetQuestionOutput} from '../../question/dtos/get-question.dto';
import {QuestionType} from '../../question/gateways';

@InputType()
export class GetQuizInput extends PickType(Quiz, ['title']) {}

@ObjectType()
export class GetQuizOutput extends CoreOutput {
    @Field(() => String, {nullable: true})
    title?: string;

    @Field(() => String, {nullable: true})
    description?: string;

    @Field(() => [GetQuestionOutput], {nullable: true})
    questions?: GetQuestionOutput[];

    static fromQuiz(quiz: Quiz): GetQuizOutput {
        const questions = quiz.questions.map(question => {
            const answers = question.answers.map(answer => ({
                name: question.type === QuestionType.PlainText ? '' : answer.name,
            }));

            return {
                number: question.number,
                type: question.type,
                description: question.description,
                answers: answers,
            };
        });

        return {
            ok: true,
            title: quiz.title,
            description: quiz.description,
            questions: questions,
        };
    }
}
