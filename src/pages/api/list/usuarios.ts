import fs from 'fs'
import path from 'path'
import type { NextApiRequest, NextApiResponse } from 'next'

const filePath = path.join(process.cwd(), 'src', 'pages', 'api', 'bd.json')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    res.status(200).json({ usuarios: data.usuarios })
}
