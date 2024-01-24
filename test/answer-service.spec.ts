import { Test, TestingModule } from "@nestjs/testing";
import { AnswerService } from "../src/answer/answer.service";
import { CreateAnswerInput } from "../src/answer/dtos/create-answer.dto";
import { EntityManager } from "typeorm";
import * as messageUtils from '../src/common/utils/message.utils';


describe('AnswerService', () => {
    let service: AnswerService;
    let manager: EntityManager;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AnswerService,
          {
            provide: EntityManager,
            useValue: {
              save: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<AnswerService>(AnswerService);
      manager = module.get<EntityManager>(EntityManager);
    });
  
  
    describe('bulkCreateAnswers', () => {
      it('should successfully create answers', async () => {
        const answerInput: CreateAnswerInput[] = [];
  
        jest.spyOn(manager, 'save').mockResolvedValue(answerInput);
  
        const result = await service.bulkCreateAnswers(answerInput, manager);
  
        expect(result.ok).toBeTruthy()
        expect(result.answers).toBe(answerInput)
      });
  
      it('should handle errors when creating answers fails', async () => {
        const answerInput: CreateAnswerInput[] = [];
        const error = new Error('some error');
  
        jest.spyOn(manager, 'save').mockRejectedValue(error);
        jest.spyOn(messageUtils, 'getErrorMessage').mockReturnValue('Error message');
  
        const result = await service.bulkCreateAnswers(answerInput, manager);
  
        expect(result.ok).toBeFalsy();
        expect(result.error).toBeDefined();
      });
    });
  });