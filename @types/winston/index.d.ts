import { Logger } from "winston"; // Logger being used
export {};

interface Logger {
  info: any;
}

interface Logger extends Logger {
  info: string;
}
