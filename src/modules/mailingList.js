import mongoose from 'mongoose';

const mailingListSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const MailingList = mongoose.model('MailingList', mailingListSchema);

export default MailingList;
