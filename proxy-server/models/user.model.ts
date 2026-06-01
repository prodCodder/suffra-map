import mongoose, {Schema} from 'mongoose';

const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export enum IERoles {
    user = "user",
    subscriber = "subscriber",
    admin = "admin",
    superAdmin = "superAdmin"
}

export interface IUser {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    city: string;
    profession?: string;
    role: IERoles;
    isActive: boolean;
    isVerified?: boolean;
    isSuscriber?: boolean;
    _doc: Omit<IUser, "_doc">;
}

const rolesEnum: IERoles[] = [IERoles.user, IERoles.subscriber, IERoles.admin, IERoles.superAdmin];

const UsersSchema: Schema = new Schema(
    {
        username:{
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true,
            match: [/^[a-zA-Z0-9_]+$/, "Le nom d'utilisateur ne doit contenir que des lettres, chiffres et underscores (pas d'espaces ni caractères spéciaux)."]
        },
        firstname:{
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true
        },
        lastname:{
            type: String,
            minLength: 3,
            maxLength: 30,
            required: true
        },
        email:{
            type: String,
            unique: true,
            required: true,
            match: [emailRegex, 'Please provide a valid email address']
        },
        password:{
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true,
            trim: true,
            validate: {
                validator: (v: Date) => {
                    const minDate = new Date('1900-01-01');
                    const maxDate = new Date();
                    return v >= minDate && v <= maxDate;
                },
                message: (props: {value: Date}) => `Date invalide : ${props.value}`
            }
        },
        city:{
            type: String,
            required: true
        },
        profession:{
            type: String,
            required: false
        },
        role:{
            type: String,
            enum: rolesEnum,
            default: rolesEnum[0],
            required: true
        },
        isActive:{
            type: Boolean,
            default: true,
        },
        isVerified:{
            type: Boolean,
            default: false,
        },
        isSuscriber:{
            type: Boolean,
            default: false,
        },
        } ,  { timestamps: { createdAt: true    }
    }
)

export default mongoose.model<IUser>('Users', UsersSchema)
