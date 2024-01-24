import {Inject, Injectable} from '@nestjs/common';
import {QuestionType, TypeGateway} from '../gateways';
import {CreateQuestionInput, CreateQuestionOutput} from '../dtos/create-question.dto';
import {getErrorMessage} from '../../common/utils/message.utils';
import {Question} from '../entities/question.entity';
import {CheckAnswerInput} from '../../answer/dtos/check-answer.dto';

@Injectable()
export class TypeGatewayService {
    private typeGateways: Record<string, TypeGateway> = {};

    constructor(
        @Inject('TypeGatewayProvider')
        private typeGatewayProvider: Record<QuestionType, TypeGateway>,
    ) {
        this.registerTypeGateways();
    }

    private registerTypeGateways() {
        Object.entries(this.typeGatewayProvider).forEach(([questionType, gateway]) => {
            this.registerTypeGateway(questionType as QuestionType, gateway);
        });
    }

    private registerTypeGateway(questionMethod: QuestionType, gateway: TypeGateway) {
        this.typeGateways[questionMethod] = gateway;
    }

    public validateType(question: CreateQuestionInput): CreateQuestionOutput {
        const gateway = this.typeGateways[question.type];
        if (gateway) {
            return gateway.validate(question);
        }
        return {
            ok: false,
            error: getErrorMessage('genericUnknownTypeError'),
        };
    }

    public checkType(question: Question, userAnswers: CheckAnswerInput[]): boolean {
        const gateway = this.typeGateways[question.type];
        if (gateway) {
            return gateway.checkAnswers(question.answers, userAnswers);
        }
        return false;
    }
}
