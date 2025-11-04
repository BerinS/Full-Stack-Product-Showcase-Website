import express from "express"
import {getAllProducts, getProductById, createProduct, updateProduct, deleteProductById} from "../controllers/productsController.js"
import authorize from "../middleware/authMiddleware.js";

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProductById);
productsRouter.post("/", authorize(['admin']), createProduct);
productsRouter.put("/:id", authorize(['admin']), updateProduct);
productsRouter.delete("/:id", authorize(['admin']), deleteProductById);


export default productsRouter;