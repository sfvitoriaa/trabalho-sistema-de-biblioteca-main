import { useState, useEffect } from "react";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });

  useEffect(() => {
    fetch("/api/list/usuarios")
      .then(r => r.json())
      .then(d => setUsuarios(d.usuarios || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/create/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ nome: "", email: "", telefone: "" });
    const d = await fetch("/api/list/usuarios").then(r => r.json());
    setUsuarios(d.usuarios || []);
  }

  return (
    <div className="container">
      <h1>Usuários</h1>

      {/* Formulário */}
      <form className="card" onSubmit={handleSubmit}>
        <h2>Novo usuário</h2>
        <input
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
          placeholder="Nome completo"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="email@exemplo.com"
          required
        />
        <input
          value={form.telefone}
          onChange={e => setForm({ ...form, telefone: e.target.value })}
          placeholder="(11) 99999-9999"
          required
        />
        <button className="btn btn-primary">Cadastrar</button>
      </form>

      {/* Lista */}
      <div className="card">
        <h2>Lista de usuários</h2>
        {usuarios.length === 0 ? (
          <p>Nenhum usuário cadastrado.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
