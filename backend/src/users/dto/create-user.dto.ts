import { IsEmail, IsString, MinLength } from 'class-validator';

// Este DTO descreve EXATAMENTE o que um cliente precisa enviar para
// cadastrar um herói. Cada decorator é uma regra de validação: se o dado
// não obedecer, o Nest rejeita o pedido automaticamente com erro 400,
// antes de qualquer código nosso rodar.
export class CreateUserDto {
  // Precisa ser texto e ter ao menos 2 caracteres (evita nome vazio).
  @IsString()
  @MinLength(2)
  name!: string;

  // Precisa ter formato de email válido (algo@algo.com).
  @IsEmail()
  email!: string;

  // Senha com no mínimo 6 caracteres — uma proteção básica contra
  // senhas ridiculamente curtas.
  @IsString()
  @MinLength(6)
  password!: string;

  // O personagem escolhido. Texto livre por enquanto.
  @IsString()
  character!: string;
}
