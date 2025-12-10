import { Router, Request, Response, NextFunction } from "express";
import cartService from "../services/cartService";
import { CartItemService } from "../services/cartItemService";
import createError from "http-errors";
import { Types } from "mongoose";

const router = Router();
const cartItemService = new CartItemService();

interface AuthRequest extends Request {
  user?: { id: string };
}

/**
 * POST /carts - Create a new cart for user
 */
router.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await cartService.createCart({ user_id: new Types.ObjectId(req.user.id), items: [] });
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /carts/my-cart - Get current user's cart
 */
router.get("/my-cart", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cartData = await cartService.getCartByUser(req.user.id);
    if (!cartData) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cartData);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /carts/:id - Get cart by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartData = await cartService.getCartById(req.params.id);
    res.json(cartData);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /carts - Get all carts (admin only)
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await cartService.getAllCarts(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /carts/:id - Clear cart (remove all items)
 */
router.put("/:id/clear", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cartService.clearCart(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /carts/:id - Delete cart
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.deleteCart(req.params.id);
    res.json({ message: "Cart deleted", cart });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /carts/:id/total - Get cart total price
 */
router.get("/:id/total", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Note: This is a workaround since we need user_id to get cart total
    // In real implementation, you might want to get it differently
    res.status(501).json({ message: "Use cartItemService to calculate total" });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /carts/:cartId/items - Add item to cart
 */
router.post("/:cartId/items", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { product_variant_id, quantity } = req.body;

    if (!product_variant_id || !quantity) {
      return res.status(400).json({ message: "product_variant_id and quantity are required" });
    }

    const item = await cartItemService.addItemToCart({
      cart_id: req.params.cartId,
      product_variant_id,
      quantity,
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

export default router;
