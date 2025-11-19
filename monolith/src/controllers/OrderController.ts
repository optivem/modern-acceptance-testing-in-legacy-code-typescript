import { Router, Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/OrderService';
import { PlaceOrderRequest } from '../dtos/OrderDtos';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

const router = Router();
let orderService: OrderService;

// Initialize service after database connection
function getOrderService(): OrderService {
  if (!orderService) {
    orderService = new OrderService();
  }
  return orderService;
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Manual validation for empty values before transformation
    const errorMap: Record<string, string> = {};
    
    // Check SKU
    if (req.body.sku === null || req.body.sku === undefined || 
        (typeof req.body.sku === 'string' && req.body.sku.trim() === '')) {
      errorMap.sku = 'SKU must not be empty';
    }
    
    // Check quantity
    if (req.body.quantity === null || req.body.quantity === undefined || 
        req.body.quantity === '' || 
        (typeof req.body.quantity === 'string' && req.body.quantity.trim() === '')) {
      errorMap.quantity = 'Quantity must not be empty';
    }
    
    // Check country
    if (req.body.country === null || req.body.country === undefined || 
        (typeof req.body.country === 'string' && req.body.country.trim() === '')) {
      errorMap.country = 'Country must not be empty';
    }
    
    // Return early if we have empty value errors
    if (Object.keys(errorMap).length > 0) {
      return res.status(422).json(errorMap);
    }
    
    const request = plainToClass(PlaceOrderRequest, req.body, { 
      enableImplicitConversion: true,
      excludeExtraneousValues: false 
    });
    const errors = await validate(request);

    if (errors.length > 0) {
      errors.forEach((error: any) => {
        if (error.constraints) {
          errorMap[error.property] = Object.values(error.constraints)[0] as string;
        }
      });
      return res.status(422).json(errorMap);
    }

    const response = await getOrderService().placeOrder(request);
    res.status(201)
      .location(`/api/orders/${response.orderNumber}`)
      .json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/:orderNumber', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await getOrderService().getOrder(req.params.orderNumber);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post('/:orderNumber/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getOrderService().cancelOrder(req.params.orderNumber);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as orderRouter };
