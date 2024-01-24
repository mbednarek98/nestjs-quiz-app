import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {databaseConfig, validationSchema} from './config';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: validationSchema,
        }),
        TypeOrmModule.forRoot(databaseConfig()),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}