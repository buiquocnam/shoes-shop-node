import { Router, Request, Response, NextFunction } from "express";
import { CartItemService } from "../services/cartItemService";
import createError from "http-errors";

const router = Router();
const cartItemService = new CartItemService();

interface AuthRequest extends Request {
  user?: { id: string };
}

/**
 * GET /cart-items/:id - Get cart item by ID
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await cartItemService.getCartItemById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /cart/:cartId/items - Get all items in a cart
 */
router.get("/cart/:cartId/items", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await cartItemService.getCartItems(req.params.cartId);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /cart-items/:id - Update cart item quantity
 */
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ message: "quantity is required" });
    }

    const item = await cartItemService.updateItemQuantity(req.params.id, quantity);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /cart-items/:id - Remove item from cart
 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await cartItemService.removeItemFromCart(req.params.id);
    res.json({ message: "Item removed", item });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /cart-items - Get all cart items (admin only)
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await cartItemService.getAllCartItems(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /cart-items/validate/:id - Validate single cart item
 */
router.post("/validate/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isValid = await cartItemService.validateCartItem(req.params.id);
    res.json({ valid: isValid });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /cart-items/validate-all - Validate all items in cart
 */
router.post("/validate-all/:cartId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isValid = await cartItemService.validateAllCartItems(req.params.cartId);
    res.json({ valid: isValid });
  } catch (err) {
    next(err);
  }
});

export default router;
