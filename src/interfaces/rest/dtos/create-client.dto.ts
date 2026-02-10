import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsOptional, MaxLength, Matches } from 'class-validator'

export class CreateClientRequestDto {
  @ApiProperty({
    description: 'Client full name',
    example: 'João Silva',
  })
  @IsString()
  @MaxLength(200)
  name: string

  @ApiProperty({
    description: 'Client email address',
    example: 'joao.silva@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Brazilian CPF or CNPJ (11 or 14 digits)',
    example: '123.456.789-00',
  })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{11}$|^\d{14}$/, {
    message: 'CPF/CNPJ must be in format XXX.XXX.XXX-XX or XX.XXX.XXX/XXXX-XX',
  })
  cpfCnpj: string

  @ApiProperty({
    description: 'Client phone number',
    example: '(11) 98765-4321',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @ApiProperty({
    description: 'Client address',
    example: 'Rua Example, 123 - São Paulo/SP',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string
}
