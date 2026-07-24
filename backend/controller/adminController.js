import { Admin, Article } from "../models/adminModels.js";

export const getAllData = async (req, res) => {
  try {
    const respon = await Article.findAll()
    res.status(200).json(respon)
  } catch (err) {
    console.log(`Error : ${err}`)
  }
}

export const getDataById = async (req, res) => {
  try {
    const respon = await Article.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(respon)
  } catch (err) {
    console.log(`Error : ${err}`)
  }
}

