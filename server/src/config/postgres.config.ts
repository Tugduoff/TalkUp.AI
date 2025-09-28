import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export default (): PostgresConnectionOptions => {
  const port = process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT)
    : 5432;
  const host =
    process.env.DOCKER_RUN === "true"
      ? process.env.POSTGRES_DOCKER_HOST
      : process.env.POSTGRES_HOST;
  const sync = process.env.POSTGRES_SYNC === "true";

  // console.log('--- DB CONNECTION ATTEMPT DEBUG ---');
  // console.log(`DOCKER_RUN check: ${process.env.DOCKER_RUN === "true" ? 'Local Docker' : 'Production/Railway'}`);
  // console.log(`Using Resolved HOST: ${host}`);
  // console.log(`Using Resolved PORT: ${port}`);
  // console.log(`Using Resolved USER: ${process.env.POSTGRES_USER}`);
  // console.log('-----------------------------------');

  return {
    type: "postgres",
    host: host,
    port: port,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    synchronize: sync,
  };
};
