import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiUnauthorizedResponse({
  description: 'Unauthorized Bearer Auth',
})
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'Usuario registrado',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  profile(@Request() req) {
    return req.user;
  }
}
