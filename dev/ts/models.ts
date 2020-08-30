export default interface Model {
  id: number;
}

export interface Produto extends Model {
  nome: string;
  preco: number;
  qntd_estoque: number;
  descricao: string;
  medidas: string;
  data_criacao: string;
}