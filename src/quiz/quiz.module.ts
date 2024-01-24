import {Module} from '@nestjs/common';
import {QuizService} from './quiz.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {QuizResolver} from './quiz.resolver';
import {Quiz} from './entites/quiz.entity';
import {QuestionModule} from '../question/question.module';

@Module({
    imports: [TypeOrmModule.forFeature([Quiz]), QuestionModule],
    providers: [QuizService, QuizResolver],
    exports: [QuizService],
})
export class QuizModule {}
