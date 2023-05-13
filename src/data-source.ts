import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { CounterRead } from "./entity/counter-read";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3307,
  username: "root",
  password: "sgRMtt2017",
  database: "node",
  synchronize: true,
  logging: false,
  entities: [User, CounterRead],
  migrations: [],
  subscribers: [],
});
