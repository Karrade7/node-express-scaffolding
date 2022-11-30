// requirements for the entire app
"use strict";

const path = require("path"); // module to read paths on the server

process.env["NODE_CONFIG_DIR"] = path.join(ABSOLUTE_PATH, "config");
const config = require("config");
const logger = require("winston"); // Logger being used
const errorHandler = require("../util/errorHandler"); // load error routines

// Requirements for this script
const { Pool, Client } = require("pg");

// pools will use environment variables
// for connection information
const pool = new Pool();

export async function readDB() {
  logger.info("Read DB");

  const sqlReq = "SELECT * FROM testDB where ID = $1";
  const sqlValues = "1";
  try {
    var queryResults: { rows: Array<any> } = await pool.query(sqlReq, sqlValues);
  } catch (e: any) {
    if (!e.level) e.level = "high";
    if (!e.level) e.type = "database";
    throw e;
  }
  return queryResults;
}

export async function writeDB(data: any) {
  logger.info("Saving to DB");

  const { results } = await pool.query("INSERT INTO testDB (assessment) VALUES ($1)", { hello: "world" });

  return results;
}

export async function init() {
  logger.info("Initializing DB");
  const sql = `
  DROP TABLE IF EXISTS testDB;
  CREATE TABLE testDB(
    id serial primary key,
    data jsonb not null,
    created_at timestamp not null default now()
  );
  INSERT INTO testDB (assessment) VALUES ('{hello: "world"}');
  `;

  let results = {};
  try {
    results = await pool.query(sql);
  } catch (e: any) {
    e.level = "high";
    e.type = "database";
    console.warn("Fail at init");
    throw e;
  }

  return results;
}
