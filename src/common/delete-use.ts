
import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

// Código de erro do Postgres quando o registro ainda é usado por outra tabela
const RECORD_IN_USE = '23503';

// Tenta excluir. Se o registro estiver em uso (ex.: mesa com comandas),
// responde 409 com uma mensagem clara, em vez de erro 500.
export async function deleteUse(
  remove: () => Promise<unknown>,
  messageIfInUse: string,
): Promise<void> {
  try {
    await remove();
  } catch (error) {
    const code = (error as QueryFailedError & { driverError?: { code?: string } })
      .driverError?.code;

    if (error instanceof QueryFailedError && code === RECORD_IN_USE) {
      throw new ConflictException(messageIfInUse);
    }

    throw error;
  }
}
