import sumopod from "../lib/sumopod.js";
import UnprocessableEntityError from "../errors/unprocessableEntity.js";

const MAX_ATTEMPTS = 3; // 1 initial call + up to 2 retries

/**
 * The output schema mobile parses (mirrors assets/json/exam_template.json):
 * {
 *   "questions": string,           // NOTE: plural, kept for backward compat
 *   "options": [{ option, correct }] x4,   // exactly one correct: true
 *   "answer": string,              // equals the correct option text
 *   "explanation": string
 * }
 */
const buildMessages = (chapter) => {
  const systemPrompt = [
    "Kamu adalah generator soal Fisika untuk siswa Kelas 7 SMP di Indonesia.",
    "Buat TEPAT SATU soal pilihan ganda dalam Bahasa Indonesia.",
    "Balas HANYA dengan JSON valid (tanpa teks tambahan, tanpa markdown) dengan struktur persis:",
    '{',
    '  "questions": "<teks soal>",',
    '  "options": [',
    '    { "option": "<pilihan 1>", "correct": false },',
    '    { "option": "<pilihan 2>", "correct": false },',
    '    { "option": "<pilihan 3>", "correct": false },',
    '    { "option": "<pilihan 4>", "correct": false }',
    '  ],',
    '  "answer": "<teks pilihan yang benar>",',
    '  "explanation": "<penjelasan jawaban benar>"',
    '}',
    "Aturan wajib: tepat 4 opsi, tepat SATU opsi bernilai correct: true,",
    'dan "answer" harus sama persis dengan teks opsi yang benar.',
  ].join("\n");

  const userPrompt = `Buatkan soal Fisika Kelas 7 SMP dengan bab: ${chapter}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
};

/**
 * Extract a JSON object from a model response that may contain extra text
 * or markdown fences, then parse it. Returns null on failure.
 */
const extractJson = (raw) => {
  if (!raw) return null;

  let text = raw.trim();

  // Strip ```json ... ``` or ``` ... ``` fences if present.
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Fall back to the first {...} block.
  if (!text.startsWith("{")) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    text = text.slice(start, end + 1);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

/**
 * Validate and normalize the parsed object to the contract schema.
 * Throws on any rule violation.
 */
const normalize = (parsed) => {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Bukan objek JSON");
  }

  const questions = parsed.questions ?? parsed.question;
  if (typeof questions !== "string" || questions.trim() === "") {
    throw new Error("Field 'questions' tidak valid");
  }

  if (!Array.isArray(parsed.options) || parsed.options.length !== 4) {
    throw new Error("Field 'options' harus berisi tepat 4 item");
  }

  const options = parsed.options.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("Item option tidak valid");
    }
    const option = item.option;
    const correct = item.correct;
    if (typeof option !== "string" || option.trim() === "") {
      throw new Error("Teks option tidak valid");
    }
    if (typeof correct !== "boolean") {
      throw new Error("Field 'correct' harus boolean");
    }
    return { option, correct };
  });

  const correctOptions = options.filter((item) => item.correct);
  if (correctOptions.length !== 1) {
    throw new Error("Harus ada tepat satu opsi yang benar");
  }

  const answer = parsed.answer;
  if (typeof answer !== "string" || answer !== correctOptions[0].option) {
    throw new Error("Field 'answer' harus sama dengan opsi yang benar");
  }

  const explanation = parsed.explanation;
  if (typeof explanation !== "string" || explanation.trim() === "") {
    throw new Error("Field 'explanation' tidak valid");
  }

  return { questions, options, answer, explanation };
};

const generateQuestion = async (chapter) => {
  const messages = buildMessages(chapter);
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const content = await sumopod.createChatCompletion({ messages });

    const parsed = extractJson(content);

    try {
      return normalize(parsed);
    } catch (error) {
      lastError = error;
    }
  }

  throw new UnprocessableEntityError(
    "Gagal menghasilkan soal, coba lagi."
  );
};

export default { generateQuestion };
