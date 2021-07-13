const { AuthenticationError } = require('apollo-server');
const Pin = require('./models/Pin');

const authenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser){
        throw new AuthenticationError('You must be logged in');
    }
    return next(root, args, ctx, info);
}

module.exports = {
    Query: {
        me: authenticated((root, args, ctx) => ctx.currentUser),
        getPins: async (root, args, ctx) => {
            const pins = await Pin.find({}).populate('author').populate('comments.author');
            return pins;
        }
    },
    Mutation: {
        createPin: authenticated(async (root, args, ctx) => {
            var createdPin = await new Pin({
                ...args.input,
                author: ctx.currentUser._id
            }).save();
            const pinAdded = Pin.populate(createdPin,'author');
            return pinAdded;
        }),
        deletePin: authenticated(async (root, args, ctx) => {
            const deletedPin = await Pin.findOneAndDelete({ _id : args.pinId}).exec();
            return deletedPin;
        }),
        createComment: authenticated(async (root, args, ctx) => {
            const newComment = { text: args.text, author: ctx.currentUser._id };
            const updatedPin = await Pin.findByIdAndUpdate(
                { _id : args.pinId },
                { $push : { comments: newComment } },
                { new : true }
            ).populate('author')
            .populate('comments.author');
            return updatedPin;
        })
    }
}

