import { http } from "../utils/http";
import { origin } from "../utils/env";

export async function getUserInfo(body) {
  return await http({
    methos: 'GET',
    url: `${origin}/user/info`,
    data: body,
  });
}