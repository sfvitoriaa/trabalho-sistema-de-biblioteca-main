import { useState, useEffect } from "react";

interface Usuario { id: string; nome: string; }
interface Livro { id: string; titulo: string; quantidade: number; qtdEmprestados: number; }
interface Emprestimo { id: string; usuarioId: string; livrosIds: string[]; dataEmprestimo: string; status: string; }

export default function Emprestimos() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  const [usuarioId, setUsuarioId] = useState("");
  const [livroSel, setLivroSel] = useState(""); // agora só um livro
  const [emprestimoId, setEmprestimoId] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/list/usuarios").then(r => r.json()),
      fetch("/api/list/livros").then(r => r.json()),
      fetch("/api/list/emprestimos").then(r => r.json()),
    ]).then(([u, l, e]) => {
      setUsuarios(u.usuarios || []);
      setLivros(l.livros || []);
      setEmprestimos(e.emprestimos || []);
    });
  }, []);

  const disponiveis = livros.filter(l => l.quantidade > l.qtdEmprestados);
  const ativos = emprestimos.filter(e => e.status === "ativo");

  async function registrarEmprestimo(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/emprestar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId, livrosIds: [livroSel] }), // envia só um livro
    });
    setUsuarioId(""); setLivroSel("");
  }

  async function confirmarDevolucao(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/devolver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emprestimoId }),
    });
    setEmprestimoId("");
  }

  return (
    <div className="container">
      <h1>Empréstimos</h1>

      {/* Novo empréstimo */}
      <form className="card" onSubmit={registrarEmprestimo}>
        <h2>Novo empréstimo</h2>
        <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)} required>
          <option value="">Selecione um usuário...</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>

        <select value={livroSel} onChange={e => setLivroSel(e.target.value)} required>
          <option value="">Selecione um livro...</option>
          {disponiveis.map(l => (
            <option key={l.id} value={l.id}>
              {l.titulo} ({l.quantidade - l.qtdEmprestados} disponíveis)
            </option>
          ))}
        </select>

        <button className="btn btn-primary" disabled={!usuarioId || !livroSel}>
          Registrar
        </button>
      </form>

      {/* Devolução */}
      <form className="card" onSubmit={confirmarDevolucao}>
        <h2>Devolução</h2>
        <select value={emprestimoId} onChange={e => setEmprestimoId(e.target.value)} required>
          <option value="">Selecione um empréstimo...</option>
          {ativos.map(emp => (
            <option key={emp.id} value={emp.id}>
              {usuarios.find(u => u.id === emp.usuarioId)?.nome} — {emp.livrosIds.length} livro(s)
            </option>
          ))}
        </select>
        <button className="btn btn-primary" disabled={!emprestimoId}>
          Confirmar
        </button>
      </form>

      {/* Histórico */}
      <div className="card">
        <h2>Histórico de empréstimos</h2>
        {emprestimos.length === 0 ? (
          <p>Nenhum empréstimo registrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Livro</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {emprestimos.map(emp => (
                <tr key={emp.id}>
                  <td>{usuarios.find(u => u.id === emp.usuarioId)?.nome}</td>
                  <td>{emp.livrosIds.map(id => livros.find(l => l.id === id)?.titulo).join(", ")}</td>
                  <td>{new Date(emp.dataEmprestimo).toLocaleDateString("pt-BR")}</td>
                  <td>{emp.status === "ativo" ? "Em andamento" : "Concluído"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
