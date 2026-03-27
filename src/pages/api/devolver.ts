import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "src", "pages", "api", "bd.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensagem: "Método não permitido." });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const { livros, emprestimos } = data;

  const { emprestimoId } = req.body;

  if (!emprestimoId) {
    return res.status(400).json({ mensagem: "O campo emprestimoId é obrigatório." });
  }

  const emprestimo = emprestimos.find((e: any) => e.id === emprestimoId);

  if (!emprestimo) {
    return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
  }

  if (emprestimo.status !== "ativo") {
    return res.status(400).json({ mensagem: "Este empréstimo já foi concluído." });
  }

  // Atualiza os livros
  emprestimo.livrosIds.forEach((livroId: string) => {
    const livro = livros.find((l: any) => l.id === livroId);
    if (livro && livro.qtdEmprestados > 0) {
      livro.qtdEmprestados -= 1;
    }
  });

  // Atualiza status do empréstimo
  emprestimo.status = "concluído";
  emprestimo.dataDevolucao = new Date().toISOString();

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return res.status(200).json({
    mensagem: "Devolução realizada com sucesso!",
    emprestimo: {
      id: emprestimo.id,
      usuarioId: emprestimo.usuarioId,
      livrosIds: emprestimo.livrosIds,
      dataEmprestimo: emprestimo.dataEmprestimo,
      dataDevolucao: emprestimo.dataDevolucao,
      status: emprestimo.status,
    },
  });
}
