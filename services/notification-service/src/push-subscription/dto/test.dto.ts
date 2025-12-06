import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TestDto {
  @IsString()
  @ApiProperty({ example: 'some-uuid-string', description: 'ID of the user' })
  userId: string;
}
