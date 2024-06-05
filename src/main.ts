import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seeder = app.get(SeederService);
  await seeder.seed();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Facturas api - Jesús Carrillo')
    .setDescription('endpoints')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('articles')
    .addTag('clients')
    .addTag('organizations')
    .addTag('invoices')
    .addTag('invoice details')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
