import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
// PassportStrategy(Strategy) diz: "esta é uma estratégia do tipo JWT".
// O 'jwt' entre parênteses é o NOME dela, que o guard vai usar para
// localizá-la — é como o número de registro do manual.
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    // Garante que o segredo existe ANTES de montar a strategy. Sem ele, o
    // selo não poderia ser conferido. Falhamos cedo, com uma mensagem clara,
    // em vez de subir o app com uma chave indefinida. Isso também estreita o
    // tipo de 'string | undefined' para 'string', satisfazendo o secretOrKey.
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET não está definido no .env');
    }

    super({
      // PASSO 1 do manual: de ONDE tirar o crachá da requisição.
      // O padrão é o cabeçalho Authorization no formato "Bearer <token>".
      // Esta linha ensina a strategy a extrair o token de lá.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Se o token estiver expirado, recusar. Não ignoramos a expiração.
      ignoreExpiration: false,

      // PASSO 2 do manual: com QUAL chave conferir o selo. É o mesmo
      // JWT_SECRET do .env que usamos para assinar. Tem que ser idêntico,
      // senão o selo nunca bate.
      secretOrKey: secret,
    });
  }

  // PASSO 3 do manual: o que fazer DEPOIS que o selo foi validado.
  // O Passport já conferiu a assinatura antes de chamar este método.
  // O 'payload' é o conteúdo do crachá (aquele objeto com sub, email, role
  // que montamos no login). O que este método RETORNA é anexado à
  // requisição como "o usuário autenticado", ficando disponível nos
  // controllers. Aqui escolhemos quais dados expor.
  async validate(payload: { sub: string; email: string; role: string }) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
