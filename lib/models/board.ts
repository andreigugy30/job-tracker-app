import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
	name: string;
	userId: string; // user id of the user that created the board
	columns: mongoose.Types.ObjectId[]; // a list of id's of another collection that we will create
	createdAt: Date;
	updatedAt: Date;
}

//create the collection

const BoardSchema = new Schema<IBoard>(
	{
		//define all the types and add extra types specific for MongoDB

		name: {
			type: String, //Here String is a MongoDB type,
			required: true,
		},
		userId: {
			type: String,
			required: true,
			index: true,
		},
		columns: [
			{
				type: Schema.Types.ObjectId, //id of a entry of the collection
				// a reference to which other collection is this ObjectId from***
				//  - I'll create another collection named Column
				ref: "Column",
			},
		],
	},
	{
		timestamps: true, // automatically add createdAt and updatedAt  fields to every single document that is added
	},
);

//Register collection to DB - it will create collection Board with SchemaBoard in MOngoDB

export default mongoose.models.Board ||
	mongoose.model<IBoard>("Board", BoardSchema);
