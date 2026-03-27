import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "src", "pages", "api", "bd.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido." });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const { usuarios, livros, emprestimos } = data;

  const { usuarioId, livrosIds, dataEmprestimo } = req.body;

  // validações iniciais
  if (!usuarioId || !Array.isArray(livrosIds) || livrosIds.length === 0) {
    return res
      .status(400)
      .json({ mensagem: "usuarioId e livrosIds são obrigatórios." });
  }

  const usuario = usuarios.find((u: Usuario) => u.id === usuarioId);
  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  // valida cada livro
  for (const livroId of livrosIds) {
    const livro = livros.find((l: Livro) => l.id === livroId);
    if (!livro) {
      return res
        .status(404)
        .json({ mensagem: `Livro com id "${livroId}" não encontrado.` });
    }
    if (livro.quantidade <= livro.qtdEmprestados) {
      return res
        .status(400)
        .json({ mensagem: `Livro "${livro.titulo}" sem unidades disponíveis.` });
    }
  }

  // atualiza quantidade emprestada
  livrosIds.forEach((livroId) => {
    const livro = livros.find((l: Livro) => l.id === livroId);
    if (livro) livro.qtdEmprestados += 1;
  });

  const novoEmprestimo = {
    id: uuidv4(),
    usuarioId,
    livrosIds,
    dataEmprestimo: dataEmprestimo || new Date().toISOString(),
    status: "ativo",
  };

  emprestimos.push(novoEmprestimo);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return res.status(200).json({
    mensagem: "Empréstimo realizado com sucesso!",
    emprestimo: novoEmprestimo,
  });
}

// Tipos auxiliares
interface Usuario {
  id: string;
  nome: string;
}
interface Livro {
  id: string;
  titulo: string;
  quantidade: number;
  qtdEmprestados: number;
}
