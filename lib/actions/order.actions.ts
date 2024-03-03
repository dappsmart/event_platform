"use server";

import Stripe from "stripe";

import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import Event from "../database/models/event.model";
import { ObjectId } from "mongodb";
import User from "../database/models/user.model";

import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrderedEventsByUserParams,
} from "@/types";
import Category from "../database/models/category.model";
// const populateOrderedEvent = (query: any) => {
//   return query
//     .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
//     .populate({ path: 'category', model: Category, select: '_id name' })
// }
const populateOrderedEvent = (query: any) => {
  return query
//     .populate({ path: "buyer", model: User, select: "_id firstName lastName" })
//     .populate({
//       path: "event",
//       model: Event,
//       populate: {
//         path: "organizer",
//         model: User,
//         select: "_id firstName lastName",
//       },
//       select:
//         "_id title description imageUrl startDateTime endDateTime price isFree url {organizer._id} {organizer.firstName} organizer.lastName }  ",
//     });
// 
}
;

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();

    const newOrder = await Order.create({
      ...order,
      event: order.event,
      buyer: order.buyer,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};

// GET ORDERS BY EVENT
export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    await connectToDatabase();

    if (!eventId) throw new Error("Event ID is required");
    const eventObjectId = new ObjectId(eventId);

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "buyer?",
          foreignField: "_id",
          as: "buyer?",
        },
      },
      {
        $unwind: "$buyer?",
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: "$event.title",
          eventId: "$event._id",
          buyer: {
            $concat: ["$buyerId?.firstName", " ", "$buyerId?.lastName"],
          },
        },
      },
      {
        $match: {
          $and: [
            { eventId: eventObjectId },
            { buyer: { $regex: RegExp(searchString, "i") } },
          ],
        },
      },
    ]);

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
}

// function populate(arg0: {
//   path: string;
//   model: import("mongoose").Model<any, {}, {}, {}, any, any>;
//   populate: {
//     path: string;
//     model: import("mongoose").Model<any, {}, {}, {}, any, any>;
//     select: string;
//   };
// }) {
//   throw new Error("Function not implemented.");
// }

// GET ORDERS BY USER
export async function getOrderedEventsByUser({
  userId,
  limit = 15,
  page,
}: GetOrderedEventsByUserParams) {
  try {
    await connectToDatabase();

    const conditions = { buyer: userId };
    const skipAmount = (page - 1) * limit;

    const orderedEventsQuery = Order.find(conditions)
      // .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

      .populate({
        path: "buyer",
        model: User,
        select: "_id firstName lastName",
      })
      .populate({
        path: "event", 
        model: Event,
        select:
          "_id title description imageUrl startDateTime endDateTime price isFree url {organizer._id} {organizer.firstName} organizer.lastName }  ",
        })  
        
      .populate({
        path: "event",
        model: Event,
         populate: ({
          path: "organizer",
          model: User,
          select: "_id firstName lastName",
        })})

        .populate({
          path: "event",
          model: Event,
           populate: ({
            path: "category",
            model: Category,
            select: "_id name",
          })})


      
        
        ;

    const orderedEvents = await populateOrderedEvent(orderedEventsQuery);
    const ordersCount = await Order.countDocuments(conditions);
    // const ordersCount = await Order.distinct('event._id').countDocuments(
    //   conditions
    // );

    return {
      data: JSON.parse(JSON.stringify(orderedEvents)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
