import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import type { NextApiRequest, NextApiResponse } from 'next'

const filePath = path.join(process.cwd(), 'src', 'pages', 'api', 'bd.json')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const livros = data.livros || []

    const { titulo, autor, genero, quantidade } = req.body

    if (!titulo || !autor || !genero || !quantidade) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' })
    }

    const jaExiste = livros.some(
        (l: any) =>
            l.titulo.trim().toLowerCase() === titulo.trim().toLowerCase() &&
            l.autor.trim().toLowerCase() === autor.trim().toLowerCase()
    )

    if (jaExiste) {
        return res.status(400).json({ mensagem: 'Livro já cadastrado!' })
    }

    const novoLivro = {
        id: uuidv4(),
        titulo: titulo.trim(),
        autor: autor.trim(),
        genero: genero.trim(),
        quantidade: Number(quantidade),
        qtdEmprestados: 0
    }

    livros.push(novoLivro)
    fs.writeFileSync(filePath, JSON.stringify({ ...data, livros }, null, 2))

    return res.status(200).json({ mensagem: 'Livro cadastrado com sucesso!', livro: novoLivro })
}
