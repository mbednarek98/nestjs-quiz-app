import {Module} from '@nestjs/common';
import {QuestionService} from './question.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Question} from './entities/question.entity';
import { AnswerModule } from 'src/answer/answer.module';

@Module({
    imports: [TypeOrmModule.forFeature([Question]), AnswerModule],
    providers: [QuestionService],
    exports: [QuestionService],
})
export class QuestionModule {}
