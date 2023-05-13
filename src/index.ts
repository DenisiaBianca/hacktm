import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import router from "./routes";
import mqtt from "mqtt";
import cors from "cors";

import dotenv from "dotenv";
import "reflect-metadata";
import { addCount, addNewRead } from "./helpers/counter-helper";
import { CounterTypeEnum } from "./helpers";
dotenv.config();

const host = "localhost";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
export const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "admin",
  password: "admin",
  reconnectPeriod: 1000,
});
const topic = "gasSensor";

client.on("connect", () => {
  console.log("Connected");
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});
client.on("message", (topic, payload) => {
  // addNewRead(payload, topic);
  console.log("Received Message:", topic, payload.toString());

  if (topic === "gasSensor" && payload && payload.toString() != "") {
    console.log("Received Message:", topic, payload.toString());

    addCount(CounterTypeEnum.gas, 2, parseInt(payload.toString()));
  }
});

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();

    var corsOptions = {
      origin: "*",
      methods: "*",
      headers: "*",
    };
    app.use(cors(corsOptions));
    app.use(express.json());

    app.use(bodyParser.json());
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(
        swaggerJSDoc({
          swaggerDefinition: {
            openapi: "3.0.0",
            info: {
              title: "Base API",
              version: "1.0.0",
            },
            components: {
              securitySchemes: {
                jwt: {
                  type: "http",
                  scheme: "bearer",
                  in: "header",
                  bearerFormat: "JWT",
                },
              },
            },
            security: [
              {
                jwt: [],
              },
            ],
            servers: [
              {
                url: "http://localhost:5000",
                description: "Development server",
              },
            ],
          },
          apis: ["./src/routes/**/*.ts", "./src/interfaces/**/*.ts"],
        })
      )
    );

    app.use(router);
    app.listen(5000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:5000/users to see results"
    );
  })
  .catch((error) => console.log(error));
