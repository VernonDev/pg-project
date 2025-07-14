async function userRoutes(fastify, options) {
  const pool = options.pool;

  fastify.get("/users", async (request, reply) => {
    try {
      const res = await pool.query("SELECT * FROM users");
      reply.send(res.rows);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.post("/users", async (request, reply) => {
    const { name, email } = request.body;
    try {
      const res = await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
        [name, email]
      );
      reply.code(201).send(res.rows[0]);
    } catch (err) {
      reply.status(500).send({ error: err.message });
    }
  });
}

module.exports = userRoutes;
