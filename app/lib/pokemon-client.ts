import { MainClient } from "pokenode-ts";

// shared pokenode-ts client — instantiated once (singleton) so the built-in
// axios-cache-interceptor cache is reused across all server requests
export const pokeClient = new MainClient();
