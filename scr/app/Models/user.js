const mongoose = require("mongoose");
const slugify = require("slugify");
const shortid = require("shortid");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    slug: {
      type: String,
      unique: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

User.pre("save", async function (next) {
  if (!this.isModified("username") && this.slug) return next();

  try {
    let baseSlug = slugify(this.username, { lower: true, strict: true });
    let uniqueSlug = baseSlug;

    const slugExists = await mongoose.models.User.countDocuments({ slug: uniqueSlug });
    if (slugExists) {
      uniqueSlug = `${baseSlug}-${shortid.generate()}`;
    }

    this.slug = uniqueSlug;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", User);
