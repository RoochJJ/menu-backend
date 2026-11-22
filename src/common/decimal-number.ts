import { ValueTransformer } from 'typeorm';

// O Postgres devolve colunas decimal (como o preço) em texto: "29.90".
// Este conversor transforma em número ao ler do banco: 29.9
export const decimalNumber: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) =>
    value === null || value === undefined ? value : Number(value),
};