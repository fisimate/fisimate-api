import configs from "../configs/index.js";
import BadGatewayError from "../errors/badGateway.js";

/**
 * Minimal client for SumoPod's OpenAI-compatible Chat Completions API.
 * The API key stays on the server (configs.sumopodAPIKey) and is never
 * exposed to the client.
 */
const createChatCompletion = async ({ messages, temperature = 0.7 }) => {
  if (!configs.sumopodAPIKey) {
    throw new BadGatewayError("Konfigurasi AI belum tersedia di server!");
  }

  const url = `${configs.sumopodBaseUrl.replace(/\/$/, "")}/chat/completions`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${configs.sumopodAPIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: configs.sumopodModel,
        messages,
        temperature,
        response_format: { type: "json_object" },
      }),
    });
  } catch (error) {
    throw new BadGatewayError("Layanan AI tidak dapat dihubungi!");
  }

  if (!response.ok) {
    throw new BadGatewayError(
      `Layanan AI mengembalikan error (status ${response.status})!`
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new BadGatewayError("Respons AI tidak dapat dibaca!");
  }

  const content = payload?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new BadGatewayError("Respons AI kosong!");
  }

  return content;
};

export default { createChatCompletion };
