import mongoose, { Schema, Document } from "mongoose";

//Board -> Columns(Wish list/Applied/Interview/Offer/Rejected) -> Job applications
//Board contains the list of columns
//Columns contains the list of job application
export interface IColumn extends Document {
	name: string;
	boardId: mongoose.Types.ObjectId;
	order: number;
	jobApplications: mongoose.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

//create the collection

const ColumnSchema = new Schema<IColumn>(
	{
		//define all the types and add extra types specific for MongoDB

		name: {
			type: String, //Here String is a MongoDB type,
			required: true,
		},
		boardId: {
			type: mongoose.Types.ObjectId, //A type for the default id Document for relating data
			//  - will create a relationship between Column Schema and Board Schema
			ref: "Board", //
			required: true,
			index: true, //
		},
		order: {
			type: Number,
			required: true,
			default: 0,
		},
		jobApplications: [
			{
				type: Schema.Types.ObjectId,
				ref: "JobApplication",
			},
		],
	},
	{
		timestamps: true, // automatically add createdAt and updatedAt  fields to every single document that is added
	},
);

//Register collection to DB - it will create collection Column with ColumnSchema in MOngoDB

export default mongoose.models.Column ||
	mongoose.model<IColumn>("Column", ColumnSchema);
