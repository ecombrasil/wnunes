type PrimaryKey = number;

export default interface Model<T> {
  pk: PrimaryKey;
  fields: T;
  model: string;
}

export interface Produto {
  nome: string;
  preco: number;
  qntd_estoque: number;
  descricao: string;
  medidas: string;
  foto: string;
  data_criacao: string;
}

export interface Kit {
  nome: string;
  descricao: string;
  foto: string;
  data_criacao: string;
}

export interface AvaliacaoProduto {
  pk: PrimaryKey;
  pontuacao: number;
}