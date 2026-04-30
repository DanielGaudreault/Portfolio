"import axios from \"axios\";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const client = axios.create({
  baseURL: API,
  timeout: 12000,
  headers: { \"Content-Type\": \"application/json\" }
});

export async function getProjects() {
  const { data } = await client.get(\"/projects\");
  return data;
}

export async function getPosts() {
  const { data } = await client.get(\"/posts\");
  return data;
}

export async function getPost(id) {
  const { data } = await client.get(`/posts/${id}`);
  return data;
}

export async function sendContact(payload) {
  const { data } = await client.post(\"/contact\", payload);
  return data;
}
"
