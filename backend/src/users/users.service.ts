import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

// @Injectable marca esta classe como um "serviço" que o Nest sabe
// fornecer (injetar) para quem precisar dele, como o controller.
@Injectable()
export class UsersService {
  // O Nest nos entrega aqui um "repositório" da entidade User. Pense no
  // repositório como o funcionário da despensa especializado em usuários:
  // ele sabe salvar, buscar, atualizar e remover linhas da tabela users
  // sem que a gente escreva SQL.
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // PASSO 1: conferir se o email já existe. findOne busca um usuário
    // que bata com a condição. Se achar alguém, recusamos o cadastro.
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      // ConflictException devolve automaticamente o erro HTTP 409,
      // que significa "conflito" — exatamente o caso de email repetido.
      throw new ConflictException('Este email já está em uso.');
    }

    // PASSO 2: embaralhar a senha. O número 10 é o "custo" do
    // embaralhamento: quanto maior, mais lento e mais seguro. 10 é o
    // equilíbrio padrão recomendado.
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // PASSO 3: montar o novo usuário com a senha JÁ embaralhada e salvar.
    // create() apenas monta o objeto em memória; save() é quem grava no banco.
    const user = this.userRepository.create({
      ...createUserDto, // copia name, email, character do DTO
      password: hashedPassword, // sobrescreve a senha pelo hash
    });

    return this.userRepository.save(user);
  }

  // Um método auxiliar que vamos usar daqui a pouco na autenticação:
  // buscar um usuário pelo email. A autenticação precisa disto para
  // encontrar quem está tentando logar.
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
