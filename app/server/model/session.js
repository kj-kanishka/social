var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var uuid = require('node-uuid')

var SessionSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'user',
		index: {
			unique: true
		}
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	token: {
		type: String,
		default: uuid.v1(),
		index: {
			unique: true
		}
	}
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

SessionSchema.method({

});

/**
 * Statics
 */
SessionSchema.static({

});

/**
 * Register
 */

module.exports = mongoose.model('Session', SessionSchema);