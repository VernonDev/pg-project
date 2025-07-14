const Fastify = require("fastify");
const setupDatabase = require("./db");
const userRoutes = require("./routes/users");
require("dotenv").config();

(async () => {
  const fastify = Fastify({ logger: true });
  const pool = await setupDatabase();

  fastify.register(userRoutes, { pool });

  const port = process.env.PORT || 3000;
  try {
    await fastify.listen({ port });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
