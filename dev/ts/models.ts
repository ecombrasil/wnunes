type PrimaryKey = number;
type CreatedAt = string;

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
  data_criacao: CreatedAt;
}

export interface Kit {
  nome: string;
  descricao: string;
  foto: string;
  data_criacao: CreatedAt;
}

export interface AvaliacaoProduto {
  pk: PrimaryKey;
  pontuacao: number;
}

export interface ItemCarrinho {
  cliente: PrimaryKey;
  produto?: PrimaryKey;
  kit?: PrimaryKey;
  qntd: number;
}

export interface MensagemSite {
  nome: string;
  email: string;
  mensagem: string;
  data_criacao?: CreatedAt;
}
