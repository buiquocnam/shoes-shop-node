import mongoose, { Schema, Document } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser extends Document {
  id: string;
  email: string;
  name?: string;
  role: Role;
  password: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: {
      virtuals: true,
      transform: function (doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

// Virtual for id
UserSchema.virtual("id").get(function () {
  return this._id.toString();
});

export default mongoose.model<IUser>("User", UserSchema);
