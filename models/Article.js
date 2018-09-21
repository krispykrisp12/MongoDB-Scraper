let mongoose = require("mongoose");
// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
let ArticleSchema = new Schema({
	headline: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
    },
    author: {
		type: String,
		required: true	
	},
	summary: {
		type: String,
		required: true		
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
      }
});

let Article  = mongoose.model("Article", ArticleSchema);
module.exports = Article;