import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import type { NextApiRequest, NextApiResponse } from 'next'

const filePath = path.join(process.cwd(), 'src', 'pages', 'api', 'bd.json')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const { usuarios, livros, emprestimos } = data

    const { usuarioId, livrosIds, dataEmprestimo } = req.body

    if (!usuarioId || !livrosIds || !Array.isArray(livrosIds) || livrosIds.length === 0) {
        return res.status(400).json({ mensagem: 'usuarioId e livrosIds são obrigatórios.' })
    }

    const usuario = usuarios.find((u: any) => u.id === usuarioId)
    if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' })
    }

    for (const livroId of livrosIds) {
        const livro = livros.find((l: any) => l.id === livroId)

        if (!livro) {
            return res.status(404).json({ mensagem: `Livro "${livroId}" não encontrado.` })
        }

        if (livro.quantidade <= livro.qtdEmprestados) {
            return res.status(400).json({ mensagem: `Livro "${livro.titulo}" sem unidades disponíveis.` })
        }
    }

    for (const livroId of livrosIds) {
        const livro = livros.find((l: any) => l.id === livroId)
        livro.qtdEmprestados += 1
    }

    const novoEmprestimo = {
        id: uuidv4(),
        usuarioId,
        livrosIds,
        dataEmprestimo: dataEmprestimo || new Date().toISOString(),
        status: 'ativo'
    }

    emprestimos.push(novoEmprestimo)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    return res.status(200).json({ mensagem: 'Empréstimo realizado com sucesso!', emprestimo: novoEmprestimo })
}
