'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = Schema({
  content: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  usersWhoUpvoted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  usersWhoDownvoted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'answer' }]
});

questionSchema.methods.upvote = function(user, callback) {
  if (this.usersWhoUpvoted.indexOf(user._id) == -1) {
    this.usersWhoUpvoted.push(user._id);
    this.upvotes++;

    if (this.usersWhoDownvoted.indexOf(user._id) != -1) {
      this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
      this.downvotes--;
    }

    this.save(callback);
  } else {
    this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
    this.upvotes--;

    this.save(callback);
  }
};

questionSchema.methods.downvote = function(user, callback) {
  if (this.usersWhoDownvoted.indexOf(user._id) == -1) {
    this.usersWhoDownvoted.push(user._id);
    this.downvotes++;

    if (this.usersWhoUpvoted.indexOf(user._id) != -1) {
      this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
      this.upvotes--;
    }

    this.save(callback);
  } else {
    this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
    this.downvotes--;

    this.save(callback);
  }
};

module.exports = mongoose.model('question', questionSchema);
