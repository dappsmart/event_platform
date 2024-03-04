import { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  // createdAt: Date
  stripeId: string;
  totalAmount: string;
  // eventId: string
  // buyerId: string
  event: {
    _id: string;
    title: string;
    description: string;
    price: string;
    isFree: boolean;
    imageUrl: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
    url: string;
    organizer: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    category: {
      _id: string;
      name: string;
    };
  };
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export type IOrderItem = {
  _id: string;
  totalAmount: string;
  //createdAt: Date;
  eventTitle: string;
  eventId: string;
  buyer: string;
};

const OrderSchema = new Schema({
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: String,
  },
  // eventId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Event',
  // },
  // buyerId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  // }
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
