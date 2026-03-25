import { useState, useEffect } from "react";

interface Usuario   { id: string; nome: string; email: string; }
interface Livro     { id: string; titulo: string; autor: string; quantidade: number; qtdEmprestados: number; }
interface Emprestimo{ id: string; usuarioId: string; livrosIds: string[]; dataEmprestimo: string; status: string; }

export default function Emprestimos() {
  const [usuarios,    setUsuarios]    = useState<Usuario[]>([]);
  const [livros,      setLivros]      = useState<Livro[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  const [usuarioId,   setUsuarioId]   = useState("");
  const [livrosSel,   setLivrosSel]   = useState<string[]>([]);
  const [dataEmp,     setDataEmp]     = useState(() => new Date().toISOString().split("T")[0]);
  const [emprestimoId,setEmprestimoId]= useState("");

  const [msgEmp, setMsgEmp] = useState<{ ok: boolean; text: string } | null>(null);
  const [msgDev, setMsgDev] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const [u, l, e] = await Promise.all([
      fetch("/api/list/usuarios").then(r => r.json()),
      fetch("/api/list/livros").then(r => r.json()),
      fetch("/api/list/emprestimos").then(r => r.json()),
    ]);
    setUsuarios(u.usuarios || []);
    setLivros(l.livros || []);
    setEmprestimos(e.emprestimos || []);
  }

  useEffect(() => { load(); }, []);

  function toggle(id: string) {
    setLivrosSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  async function submitEmp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsgEmp(null);
    const r = await fetch("/api/emprestar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId, livrosIds: livrosSel, dataEmprestimo: new Date(dataEmp).toISOString() }),
    });
    const d = await r.json();
    setMsgEmp({ ok: r.ok, text: d.mensagem });
    if (r.ok) { setUsuarioId(""); setLivrosSel([]); setDataEmp(new Date().toISOString().split("T")[0]); load(); }
    setLoading(false);
  }

  async function submitDev(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsgDev(null);
    const r = await fetch("/api/devolver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emprestimoId }),
    });
    const d = await r.json();
    setMsgDev({ ok: r.ok, text: d.mensagem });
    if (r.ok) { setEmprestimoId(""); load(); }
    setLoading(false);
  }

  const disponiveis   = livros.filter(l => l.quantidade > l.qtdEmprestados);
  const ativos        = emprestimos.filter(e => e.status === "ativo");
  const empSelecionado= emprestimos.find(e => e.id === emprestimoId);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Empréstimos</h1>
        <p>{ativos.length} ativo{ativos.length !== 1 ? "s" : ""} · {emprestimos.length} no total</p>
      </div>

      <div className="grid-2" style={{ marginBottom: "1.5rem" }}>

       
        <div className="card">
          <p className="card-title">Novo empréstimo</p>

          {msgEmp && <div className={`alert ${msgEmp.ok ? "alert-success" : "alert-error"}`}>{msgEmp.text}</div>}

          <form onSubmit={submitEmp}>
            <div className="form-group">
              <label>Usuário</label>
              <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)} required>
                <option value="">Selecione um usuário...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Data do empréstimo</label>
              <input type="date" value={dataEmp} onChange={e => setDataEmp(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Livros disponíveis</label>
              {disponiveis.length === 0 ? (
                <p style={{ fontSize: "0.82rem", color: "#aaa", fontStyle: "italic" }}>Nenhum livro disponível.</p>
              ) : (
                <div className="check-list">
                  {disponiveis.map(l => (
                    <label className="check-item" key={l.id}>
                      <input
                        type="checkbox"
                        checked={livrosSel.includes(l.id)}
                        onChange={() => toggle(l.id)}
                      />
                      <span>{l.titulo}</span>
                      <span className="disp">{l.quantidade - l.qtdEmprestados} disp.</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-primary"  type="submit" disabled={loading || livrosSel.length === 0}>
              {loading ? "Salvando..." : "Registrar empréstimo"}
            </button>
          </form>
        </div>

        <div className="card">
          <p className="card-title">Devolução</p>

          {msgDev && <div className={`alert ${msgDev.ok ? "alert-success" : "alert-error"}`}>{msgDev.text}</div>}

          <form onSubmit={submitDev}>
            <div className="form-group">
              <label>Empréstimo ativo</label>
              {ativos.length === 0 ? (
                <p style={{ fontSize: "0.82rem", color: "#aaa", fontStyle: "italic", marginTop: "0.4rem" }}>
                  Nenhum empréstimo ativo no momento.
                </p>
              ) : (
                <select value={emprestimoId} onChange={e => setEmprestimoId(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {ativos.map(emp => {
                    const u  = usuarios.find(u => u.id === emp.usuarioId);
                    const dt = new Date(emp.dataEmprestimo).toLocaleDateString("pt-BR");
                    return (
                      <option key={emp.id} value={emp.id}>
                        {u?.nome ?? "?"} — {emp.livrosIds.length} livro(s) — {dt}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {empSelecionado && (
              <div className="dev-preview">
                <div className="dev-preview-label">Livros a devolver</div>
                {empSelecionado.livrosIds.map(id => {
                  const l = livros.find(l => l.id === id);
                  return <div key={id}>• {l?.titulo ?? id}</div>;
                })}
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading || !emprestimoId}>
              {loading ? "Salvando..." : "Confirmar devolução"}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <p className="card-title">Histórico de empréstimos</p>
        {emprestimos.length === 0 ? (
          <p className="empty">Nenhum empréstimo registrado ainda.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Livros</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...emprestimos].reverse().map(emp => {
                  const u      = usuarios.find(u => u.id === emp.usuarioId);
                  const titulos= emp.livrosIds.map(id => livros.find(l => l.id === id)?.titulo ?? id).join(", ");
                  return (
                    <tr key={emp.id}>
                      <td>{u?.nome ?? "—"}</td>
                      <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {titulos}
                      </td>
                      <td>{new Date(emp.dataEmprestimo).toLocaleDateString("pt-BR")}</td>
                      <td>
                        <span className={`badge ${emp.status === "ativo" ? "badge-ativo" : "badge-concluido"}`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
