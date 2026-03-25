import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

const filePath = path.join(process.cwd(), 'src', 'pages', 'api', 'bd.json')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const { livros, emprestimos } = data

    const { emprestimoId } = req.body

    if (!emprestimoId) {
        return res.status(400).json({ mensagem: 'emprestimoId é obrigatório.' })
    }

    const emprestimo = emprestimos.find((e: any) => e.id === emprestimoId)

    if (!emprestimo) {
        return res.status(404).json({ mensagem: 'Empréstimo não encontrado.' })
    }

    if (emprestimo.status !== 'ativo') {
        return res.status(400).json({ mensagem: 'Este empréstimo já foi concluído.' })
    }

    for (const livroId of emprestimo.livrosIds) {
        const livro = livros.find((l: any) => l.id === livroId)
        if (livro && livro.qtdEmprestados > 0) {
            livro.qtdEmprestados -= 1
        }
    }

    emprestimo.status = 'concluído'
    emprestimo.dataDevolucao = new Date().toISOString()

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    return res.status(200).json({ mensagem: 'Devolução realizada com sucesso!', emprestimo })
}
