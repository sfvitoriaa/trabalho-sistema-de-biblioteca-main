import { useState, useEffect } from "react";

interface Usuario { id: string; nome: string; email: string; telefone: string; }

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form,     setForm]     = useState({ nome: "", email: "", telefone: "" });
  const [msg,      setMsg]      = useState<{ ok: boolean; text: string } | null>(null);
  const [loading,  setLoading]  = useState(false);

  async function load() {
    const r = await fetch("/api/list/usuarios");
    const d = await r.json();
    setUsuarios(d.usuarios || []);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const r = await fetch("/api/create/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();

    setMsg({ ok: r.ok, text: d.mensagem });
    if (r.ok) { setForm({ nome: "", email: "", telefone: "" }); load(); }
    setLoading(false);
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Usuários</h1>
        <p>{usuarios.length} usuário{usuarios.length !== 1 ? "s" : ""} cadastrado{usuarios.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid-2">
       
        <div className="card">
          <p className="card-title">Novo usuário</p>

          {msg && (
            <div className={`alert ${msg.ok ? "alert-success" : "alert-error"}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome</label>
              <input
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                value={form.telefone}
                onChange={e => setForm({ ...form, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Cadastrar"}
            </button>
          </form>
        </div>
 
        <div className="card">
          <p className="card-title">Lista de usuários</p>
          {usuarios.length === 0 ? (
            <p className="empty">Nenhum usuário cadastrado ainda.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.nome}</td>
                      <td>{u.email}</td>
                      <td>{u.telefone}</td>
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
