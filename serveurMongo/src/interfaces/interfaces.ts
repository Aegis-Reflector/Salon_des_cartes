import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

export interface MyTokenPayload extends JwtPayload {
  id: ObjectId;
}
