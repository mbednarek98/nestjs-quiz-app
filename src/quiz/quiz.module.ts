import {Module} from '@nestjs/common';
import {QuizService} from './services/quiz.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {QuizResolver} from './quiz.resolver';
import {Quiz} from './entites/quiz.entity';
import {QuestionModule} from '../question/question.module';
import {QuizValidationService} from './services/quiz-validation.service';
import {TransactionManagerService} from '../common/services/transaction-manager.service';

@Module({
    imports: [TypeOrmModule.forFeature([Quiz]), QuestionModule],
    providers: [
        QuizService,
        QuizValidationService,
        TransactionManagerService,
        QuizResolver,
    ],
    exports: [QuizService],
})
export class QuizModule {}
