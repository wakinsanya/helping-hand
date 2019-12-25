import { Document } from 'mongoose';
import { User } from '@helping-hand/api-common'

export interface UserDocument extends User, Document {}
