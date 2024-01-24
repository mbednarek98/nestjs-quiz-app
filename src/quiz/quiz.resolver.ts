import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {QuizService} from './services/quiz.service';
import {CreateQuizInput, CreateQuizOutput} from './dtos/create-quiz.dto';
import {Quiz} from './entites/quiz.entity';
import {GetQuizOutput} from './dtos/get-quiz.dto';
import {CheckQuizInput, CheckQuizOutput} from './dtos/check-quiz.dto';

@Resolver(of => Quiz)
export class QuizResolver {
    constructor(private readonly quizService: QuizService) {}

    @Mutation(returns => CreateQuizOutput)
    async createQuiz(@Args('input') createQuizInput: CreateQuizInput): Promise<CreateQuizOutput> {
        return this.quizService.createQuiz(createQuizInput);
    }

    @Query(returns => GetQuizOutput)
    async getQuiz(@Args('title') title: string): Promise<GetQuizOutput> {
        return this.quizService.getQuizByTitle(title);
    }

    @Query(returns => CheckQuizOutput)
    async evaluateQuizAnswers(
        @Args('input') checkQuizInput: CheckQuizInput,
    ): Promise<CheckQuizOutput> {
        return this.quizService.evaluateQuizAnswers(checkQuizInput);
    }
}
