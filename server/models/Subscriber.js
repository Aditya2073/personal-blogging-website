import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  lastEmailSent: {
    type: Date
  },
  confirmationToken: {
    type: String
  }
});

// Add indexes
subscriberSchema.index({ email: 1 }, { unique: true });
subscriberSchema.index({ active: 1 });

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;
