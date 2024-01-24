import {CoreOutput} from '../dtos/output.dto';

export abstract class CoreValidationService {
    protected validationFailure(error: string): CoreOutput {
        return {ok: false, error};
    }

    abstract validate(input: any): CoreOutput;
}
