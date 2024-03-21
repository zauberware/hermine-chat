import { createConsumer } from "@rails/actioncable";

const DEFAULT_BASE_URL = "https://hermine.ai";

export default (baseUrl: string = DEFAULT_BASE_URL) =>
  createConsumer(`${baseUrl.replace('http', 'ws')}/cable`);
