import {Module} from '@nestjs/common';
import {QuestionService} from './services/question.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Question} from './entities/question.entity';
import {AnswerModule} from '../answer/answer.module';
import {
    MultipleCorrectGateway,
    PlainTextGateway,
    QuestionType,
    SingleCorrectGateway,
    SortingGateway,
} from './gateways';
import {TypeGatewayService} from './services/question-gateway.service';
import {QuestionValidationService} from './services/question-validation.service';

@Module({
    imports: [TypeOrmModule.forFeature([Question]), AnswerModule],
    providers: [
        QuestionService,
        {
            provide: 'TypeGatewayProvider',
            useFactory: () => ({
                [QuestionType.SingleCorrect]: new SingleCorrectGateway(),
                [QuestionType.MultipleCorrect]: new MultipleCorrectGateway(),
                [QuestionType.Sorting]: new SortingGateway(),
                [QuestionType.PlainText]: new PlainTextGateway(),
            }),
        },
        TypeGatewayService,
        QuestionValidationService,
    ],
    exports: [QuestionService, QuestionValidationService, TypeGatewayService],
})
export class QuestionModule {}
