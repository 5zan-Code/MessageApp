import mongoose, {Schema, Document} from 'mongoose'

export interface Message extends Document{
    content: string,
    createdAt: Date
}

const messgaeSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true,
        
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    }
})


export interface User extends Document{
    username: string,
    email: string,
    password: string,
    isVerified: boolean,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isAcceptingMessage: boolean,
    message: Message[]

    
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required!"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required!"],
        match: [/.+\@.+\..+/, 'Please use a valid email'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password is required!'],
        min: 6

    },
    isVerified:{
        type: Boolean,
        default: false
    },
    verifyCode:{
        type: String,
        required: [true, 'Verify code is required!']
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, 'Verify code expiry date is required!']
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    message:[messgaeSchema]
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema)


export default UserModel;