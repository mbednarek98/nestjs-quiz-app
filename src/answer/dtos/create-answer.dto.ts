import {Field, InputType, ObjectType, PickType} from '@nestjs/graphql';
import {CoreOutput} from '../../common/dtos/output.dto';
import {Answer} from '../entities/answer.entity';
import {Question} from '../../question/entities/question.entity';
import {CreateQuestionInput} from '../../question/dtos/create-question.dto';
import {EntityManager} from 'typeorm';

@InputType()
export class CreateAnswerInput extends PickType(Answer, ['name', 'is_correct', 'order']) {
    question: Question;

    static aggregateAnswersForBulkInsert(
        savedQuestions: Question[],
        questionsInput: CreateQuestionInput[],
    ): CreateAnswerInput[] {
        return savedQuestions.reduce((allAnswers, savedQuestion, index) => {
            const answersForThisQuestion = questionsInput[index].answers.map(answerInput => ({
                ...answerInput,
                question: savedQuestion,
            }));
            return [...allAnswers, ...answersForThisQuestion];
        }, []);
    }
}

@ObjectType()
export class CreateAnswerOutput extends CoreOutput {
    @Field(type => Answer, {nullable: true})
    answers?: Answer[];

    static createAnswersMap(answerInput: CreateAnswerInput[], menager: EntityManager): Answer[] {
        return answerInput.map(input => {
            return menager.create(Answer, {
                name: input.name,
                is_correct: input.is_correct,
                order: input.order,
                question: input.question,
            });
        });
    }
}
