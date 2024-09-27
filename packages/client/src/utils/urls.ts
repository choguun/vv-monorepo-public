import { IS_PRODUCTION } from "../utils/secrets";

export function getCoreUrl() {
  return IS_PRODUCTION ? process.env.CORE_URI : process.env.CORE_URI;
}

export function getServerUrl() {
  return IS_PRODUCTION ? process.env.CORE_URI : process.env.SERVER_URI;
}
