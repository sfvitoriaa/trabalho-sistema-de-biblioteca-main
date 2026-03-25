import { useState, useEffect } from "react";

interface Livro { id: string; titulo: string; autor: string; genero: string; quantidade: number; qtdEmprestados: number; }

export default function Livros() {
  const [livros,  setLivros]  = useState<Livro[]>([]);
  const [form,    setForm]    = useState({ titulo: "", autor: "", genero: "", quantidade: "" });
  const [msg,     setMsg]     = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const r = await fetch("/api/list/livros");
    const d = await r.json();
    setLivros(d.livros || []);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const r = await fetch("/api/create/livros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, quantidade: Number(form.quantidade) }),
    });
    const d = await r.json();

    setMsg({ ok: r.ok, text: d.mensagem });
    if (r.ok) { setForm({ titulo: "", autor: "", genero: "", quantidade: "" }); load(); }
    setLoading(false);
  }

  function dispBadge(l: Livro) {
    const n = l.quantidade - l.qtdEmprestados;
    if (n === 0) return <span className="badge badge-esgotado">Esgotado</span>;
    if (n <= 2)  return <span className="badge badge-baixo">{n} disp.</span>;
    return           <span className="badge badge-disp">{n} disp.</span>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Livros</h1>
        <p>{livros.length} título{livros.length !== 1 ? "s" : ""} no acervo</p>
      </div>

      <div className="grid-2">
    
        <div className="card">
          <p className="card-title">Cadastrar livro</p>

          {msg && (
            <div className={`alert ${msg.ok ? "alert-success" : "alert-error"}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título</label>
              <input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Título do livro" required />
            </div>
            <div className="form-group">
              <label>Autor</label>
              <input value={form.autor} onChange={e => setForm({ ...form, autor: e.target.value })} placeholder="Nome do autor" required />
            </div>
            <div className="form-group">
              <label>Gênero</label>
              <input value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })} placeholder="Romance, Ficção..." required />
            </div>
            <div className="form-group">
              <label>Quantidade</label>
              <input type="number" min="1" value={form.quantidade} onChange={e => setForm({ ...form, quantidade: e.target.value })} placeholder="Nº de exemplares" required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Cadastrar"}
            </button>
          </form>
        </div>

        <div className="card">
          <p className="card-title">Acervo</p>
          {livros.length === 0 ? (
            <p className="empty">Nenhum livro cadastrado ainda.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Gênero</th>
                    <th>Qtd</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {livros.map(l => (
                    <tr key={l.id}>
                      <td>{l.titulo}</td>
                      <td>{l.autor}</td>
                      <td>{l.genero}</td>
                      <td>{l.quantidade}</td>
                      <td>{dispBadge(l)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
