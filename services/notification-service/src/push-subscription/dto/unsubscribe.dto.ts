import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UnsubscribeDto {
  @IsUUID()
  @ApiProperty({ example: 'some-uuid-string', description: 'ID of the user' })
  userId: string;
  @IsString()
  @ApiProperty({ example: 'some-url-string', description: 'subscription url' })
  endpoint: string;
}
