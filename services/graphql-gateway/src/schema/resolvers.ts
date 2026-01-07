import { dashboardResolvers } from './dashboard';
import {
  productResolvers,
  orderResolvers,
  couponResolvers,
  userResolvers,
  categoryResolvers,
  reviewResolvers,
  addressResolvers,
} from './types';

export const resolvers = [
  dashboardResolvers,
  productResolvers,
  orderResolvers,
  couponResolvers,
  userResolvers,
  categoryResolvers,
  reviewResolvers,
  addressResolvers,
];
