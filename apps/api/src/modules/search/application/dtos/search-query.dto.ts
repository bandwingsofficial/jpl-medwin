import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @MaxLength(100)
  q!: string;

  @IsOptional()
  limit?: number = 10;
}
