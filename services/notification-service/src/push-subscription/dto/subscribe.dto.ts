import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsUUID } from 'class-validator';

export class SubscribeDto {
  @IsUUID()
  @ApiProperty({ example: 'some-uuid-string', description: 'ID of the user' })
  userId: string;

  @IsObject()
  @ApiProperty({
    example: '{endpoint: "" }',
    description: 'Subscription object',
  })
  subscription: any;
}
