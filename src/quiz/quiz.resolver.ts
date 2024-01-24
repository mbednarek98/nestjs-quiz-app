import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Quiz} from './entites/quiz.entity';

@Resolver(of => Quiz)
export class QuizResolver {
}
