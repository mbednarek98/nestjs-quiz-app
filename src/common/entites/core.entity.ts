import {Field, Int, ObjectType} from '@nestjs/graphql';
import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@ObjectType()
export abstract class CoreEntity {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @CreateDateColumn()
    @Field(type => Date)
    createdAt: Date;

    @UpdateDateColumn()
    @Field(type => Date)
    updatedAt: Date;
}
