import express from 'express';
import dotenv from 'dotenv';
import conectarBanco from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const conexao = conectarBanco();

app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.sendFile("tarefa.html", { root: "./public" });
});

app.get("/tarefas", async (req, res)=>{
    const sql = "SELECT * FROM tarefas";
    const resposta = await conexao.query(sql);
    res.json(resposta); 
});

// GET /tarefas - Buscar todas as tarefas
app.get('/tarefas', async (req, res) => {
    const sql = 'SELECT * FROM tarefas';
    try {
        const [linhas] = await conexao.query(sql);
        res.json(linhas);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erro ao buscar tarefas" });
    }
});

// POST /tarefas - Criar nova tarefa
app.post('/tarefas', async (req, res) => {
    const { nome, descricao, responsavel, data_tarefa, concluido } = req.body;
    const sql = "INSERT INTO tarefas (nome, descricao, responsavel, data_tarefa, concluido) VALUES (?, ?, ?, ?, ?)";

    try {
        await conexao.query(sql, [
            nome,
            descricao,
            responsavel,
            data_tarefa,
            concluido ? 1 : 0 // Converte boolean (true/false) para TINYINT (1/0)
        ]);
        
        res.status(201).json({
            message: "Tarefa cadastrada com sucesso!"
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erro ao cadastrar tarefa" });
    }
});

// GET /tarefas/:id - Buscar tarefa por ID
app.get("/tarefas/:id", async (req, res) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM tarefas WHERE id = ?";
    
    try {
        const resposta = await conexao.query(sql, [id]);
        console.log(resposta)
        if (resposta.length === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }

        // Agora resposta[0] é o objeto real da tarefa (id, nome, descricao, etc)
        res.json(resposta);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erro ao buscar tarefa" });
    }
});

app.put("/tarefas/:id", async (req, res)=>{
    const id = Number(req.params.id);
    const {nome, descricao, responsavel, data_tarefa, concluido} = req.body;
    const sql = `UPDATE tarefas SET nome=?, descricao=?, 
    responsavel=?, data_tarefa=?, concluido=? WHERE id=?`;
    // console.log(sql)
    const resposta = await conexao.query(sql,[
        nome, 
        descricao,
        responsavel,
        data_tarefa,
        concluido,
        id
    ]);
    res.status(201).json({
        message: "Tarefa atualizada com sucesso"
    })
});

app.delete("/tarefas/:id", async (req, res) => {
    const id = Number(req.params.id);
    const sql = "DELETE FROM tarefas WHERE id=?";

    try {
        const resposta = await conexao.query(sql, [id]);

        if (resposta.affectedRows === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada para exclusão" });
        }
        res.status(200).json({ message: "Tarefa excluída com sucesso!" });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Erro ao excluir tarefa" });
    }
});
 
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});