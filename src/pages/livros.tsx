import { useState, useEffect } from "react";

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  quantidade: number;
  qtdEmprestados: number;
}

export default function Livros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [form, setForm] = useState({ titulo: "", autor: "", genero: "", quantidade: "" });

  useEffect(() => {
    fetch("/api/list/livros")
      .then(r => r.json())
      .then(d => setLivros(d.livros || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/create/livros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, quantidade: Number(form.quantidade) }),
    });
    setForm({ titulo: "", autor: "", genero: "", quantidade: "" });
    const d = await fetch("/api/list/livros").then(r => r.json());
    setLivros(d.livros || []);
  }

  return (
    <div className="container">
      <h1>Livros</h1>

      {/* Formulário */}
      <form className="card" onSubmit={handleSubmit}>
        <h2>Cadastrar livro</h2>
        <input
          value={form.titulo}
          onChange={e => setForm({ ...form, titulo: e.target.value })}
          placeholder="Título"
          required
        />
        <input
          value={form.autor}
          onChange={e => setForm({ ...form, autor: e.target.value })}
          placeholder="Autor"
          required
        />
        <input
          value={form.genero}
          onChange={e => setForm({ ...form, genero: e.target.value })}
          placeholder="Gênero"
          required
        />
        <input
          type="number"
          min="1"
          value={form.quantidade}
          onChange={e => setForm({ ...form, quantidade: e.target.value })}
          placeholder="Quantidade"
          required
        />
        <button className="btn btn-primary">Cadastrar</button>
      </form>

      {/* Lista */}
      <div className="card">
        <h2>Acervo</h2>
        {livros.length === 0 ? (
          <p>Nenhum livro cadastrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Gênero</th>
                <th>Total</th>
                <th>Disponíveis</th>
              </tr>
            </thead>
            <tbody>
              {livros.map(l => (
                <tr key={l.id}>
                  <td>{l.titulo}</td>
                  <td>{l.autor}</td>
                  <td>{l.genero}</td>
                  <td>{l.quantidade}</td>
                  <td>{l.quantidade - l.qtdEmprestados} em estoque</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
