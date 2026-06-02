import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity transforma esta classe numa tabela do banco.
// Sem este decorator, seria uma classe TypeScript comum, ignorada pelo TypeORM.
@Entity('users') // 'users' é o nome que a tabela terá no Postgres
export class User {
  // A chave primária: um número inteiro que o Postgres incrementa sozinho
  // a cada novo usuário (1, 2, 3...). @PrimaryGeneratedColumn() sem argumento
  // gera uma coluna auto-incremento simples.
  @PrimaryGeneratedColumn()
  id!: number;

  // Coluna de texto simples para o nome do herói.
  @Column()
  name!: string;

  // O email precisa ser único: dois heróis não podem se cadastrar com o
  // mesmo email. O { unique: true } cria essa regra direto no banco, então
  // mesmo que a gente esqueça de checar no código, o banco recusa duplicatas.
  @Column({ unique: true })
  email!: string;

  // A senha. Importante: aqui NÃO vamos guardar a senha digitada pelo
  // usuário diretamente. Mais adiante, no service, vamos transformá-la
  // num "hash" (um embaralhamento irreversível) antes de salvar. Por ora,
  // a coluna só precisa existir.
  @Column()
  password!: string;

  // O personagem escolhido (Marvel, DC etc.), pedido explicitamente no desafio.
  @Column()
  character!: string;

  // O papel do usuário. Usamos um valor padrão 'hero' para que todo mundo
  // que se cadastra seja herói comum por padrão. Só um admin (definido
  // manualmente ou por outra regra) terá 'admin'. É ISTO que vai permitir,
  // lá no frontend e nos guards, restringir a criação de projetos.
  @Column({ default: 'hero' })
  role!: string;
}
