import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler, methodNotAllowedHandler,logger } from './utils/middleware/error-handler';
import authRouter from "./Auth/auth.route"
import customerRouter from "./Customer/customer.route"
import productRouter from "./Product/product.route"
import officerRouter from "./Officer/officer.route"
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('welcome to EmmaSunny api');
});
app.use("/auth",authRouter)
app.use("/customer", customerRouter)
app.use("/product", productRouter)
app.use("/officer", officerRouter)

// 404 handler
app.use(notFoundHandler);
app.use(methodNotAllowedHandler(['GET', 'POST', 'PUT', 'DELETE']));
// Global error handler - must be last middleware
app.use(errorHandler);

const port = process.env.PORT || 5000;
  // console.log("jwt_secret:",JWT_SECRET);

app.listen(port, () => {
  logger.info(`App is running on port ${port}`);
  console.log(`App is running on port ${port}`);
});