async function subjectRoutes(fastify, options) {
  const pool = options.pool;

  fastify.get("/subjects", async (request, reply) => {
    try {
      const res = await pool.query("SELECT * FROM subjects");
      reply.send(res.rows);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.post("/subjects", async (request, reply) => {
    const { name } = request.body;
    try {
      const res = await pool.query(
        "INSERT INTO subjects (name) VALUES ($1) RETURNING *",
        [name]
      );
      reply.code(201).send(res.rows[0]);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });
}

module.exports = subjectRoutes;
