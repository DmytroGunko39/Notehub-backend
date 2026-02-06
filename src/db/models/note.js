// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    tag: {
      type: String,
      default: null,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
    versionKey: false,
  },
);

const NotesCollection = mongoose.model('Note', notesSchema);

export default NotesCollection;
