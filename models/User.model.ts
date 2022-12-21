import mongoose, { Schema, Model, Document } from "mongoose";

type UserDocument = Document & {
  id: number;
  email: string;
  name: string;
  gender: string;
  status: string;
};

type UserInput = {
  id: UserDocument["id"];
  email: UserDocument["email"];
  name: UserDocument["name"];
  gender: UserDocument["gender"];
  status: UserDocument["status"];
};

const userSchema = new Schema(
  {
    id: {
      type: Schema.Types.Number,
      required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    gender: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

export { User, UserInput, UserDocument };
