import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import type { NextApiRequest, NextApiResponse } from 'next'

const filePath = path.join(process.cwd(), 'src', 'pages', 'api', 'bd.json')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const usuarios = data.usuarios || []

    const { nome, email, telefone } = req.body

    if (!nome || !email || !telefone) {
        return res.status(400).json({ mensagem: 'Nome, email e telefone são obrigatórios.' })
    }

    if (usuarios.some((u: any) => u.email === email)) {
        return res.status(400).json({ mensagem: 'Usuário já cadastrado com este e-mail!' })
    }

    const novoUsuario = { id: uuidv4(), nome, email, telefone }

    usuarios.push(novoUsuario)
    fs.writeFileSync(filePath, JSON.stringify({ ...data, usuarios }, null, 2))

    return res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario: novoUsuario })
}
