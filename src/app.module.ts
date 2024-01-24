import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {GraphQLModule} from '@nestjs/graphql';
import {TypeOrmModule} from '@nestjs/typeorm';
import {databaseConfig, validationSchema} from './config';
import {QuizModule} from './quiz/quiz.module';
import {CommonModule} from './common/common.module';
import {QuestionModule} from './question/question.module';
import {AnswerModule} from './answer/answer.module';
import {ThrottlerModule} from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';
import {GqlThrottlerGuard} from './config/gql.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: validationSchema,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 1000,
                limit: 10,
            },
        ]),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            playground: true,
            context: ({req, res}) => ({req, res}),
        }),
        TypeOrmModule.forRoot(databaseConfig()),
        QuizModule,
        CommonModule,
        QuestionModule,
        AnswerModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: GqlThrottlerGuard,
        },
    ],
})
export class AppModule {}
