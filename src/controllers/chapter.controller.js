import { chapterService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const index = async (req, res, next) => {
  try {
    const chapters = await chapterService.getAlls();

    return apiSuccess(res, "Berhasil mendapatkan semua data bab!", chapters);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chapter = await chapterService.getOne(id);

    return apiSuccess(res, "Berhasil mendapatkan data bab!", chapter);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const chapter = await chapterService.create(req);

    return apiSuccess(res, "Berhasil membuat bab baru!", chapter);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chapter = await chapterService.update(id, req);

    return apiSuccess(res, "Berhasil update bab!", chapter);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    await chapterService.remove(id);

    return apiSuccess(res, "Berhasil hapus bab!");
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  show,
  create,
  update,
  destroy,
};
