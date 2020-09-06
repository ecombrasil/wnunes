export default interface Model<T> {
  pk: number;
  fields: T;
  model: string;
}

export interface Produto {
  nome: string;
  preco: number;
  qntd_estoque: number;
  descricao: string;
  medidas: string;
  data_criacao: string;
  foto: string;
}