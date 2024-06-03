const mongoose = require('mongoose')

const responseSchema = new mongoose.Schema({
    questions: {text: { type: String, required: true },
    questionNo: {type: Number},
    option1: { type: Number, default: 0 },
    option2: { type: Number, default: 0 },
    option3: { type: Number, default: 0 },
    option4: { type: Number, default: 0 },
    option5: { type: Number, default: 0 }
    },
    
    batch:{
        type : String
    },
    
    semester:{
        type : String
    },

});
  
  const ResponseQuestion = mongoose.model('ResponseQuestion', responseSchema);
  module.exports = ResponseQuestion;