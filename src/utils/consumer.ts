import { createConsumer } from "@rails/actioncable";

// TODO: change route
export default createConsumer("ws://localhost:3000/cable");
