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

  function badgeDisponivel(l: Livro) {
    const disponiveis = l.quantidade - l.qtdEmprestados;
    if (disponiveis === 0) return <span className="badge badge-esgotado">❌ Esgotado</span>;
    return <span className="badge badge-ativo">📚 {disponiveis} disponíveis</span>;
  }

  return (
    <div className="container">
      <h1>📚 Catálogo de Livros</h1>

      {/* Formulário */}
      <form className="card" onSubmit={handleSubmit}>
        <h2>➕ Adicionar novo livro</h2>
        <label>📖 Título</label>
        <input
          value={form.titulo}
          onChange={e => setForm({ ...form, titulo: e.target.value })}
          required
        />
        <label>✍️ Autor</label>
        <input
          value={form.autor}
          onChange={e => setForm({ ...form, autor: e.target.value })}
          required
        />
        <label>🏷️ Gênero</label>
        <input
          value={form.genero}
          onChange={e => setForm({ ...form, genero: e.target.value })}
          required
        />
        <label>📦 Quantidade</label>
        <input
          type="number"
          min="1"
          value={form.quantidade}
          onChange={e => setForm({ ...form, quantidade: e.target.value })}
          required
        />
        <button className="btn btn-primary">Cadastrar livro</button>
      </form>

      {/* Lista em cards */}
      <div className="card">
        <h2>📚 Acervo</h2>
        {livros.length === 0 ? (
          <p>Nenhum livro cadastrado.</p>
        ) : (
          <div className="grid-3">
            {livros.map(l => (
              <div key={l.id} className="livro-card">
                <h3>{l.titulo}</h3>
                <p><strong>Autor:</strong> {l.autor}</p>
                <p><strong>Gênero:</strong> {l.genero}</p>
                <p><strong>Total:</strong> {l.quantidade}</p>
                {badgeDisponivel(l)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
