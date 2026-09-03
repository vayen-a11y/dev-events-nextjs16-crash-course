'use server';

import Booking from '@/database/booking.model';
import connectDB from "@/lib/mongodb";

export const createBooking = async ({eventId,slug,email}:{eventId:string;slug:string;email:string;}) => {
    try{
        await connectDB();
        await Booking.create({eventId,slug,email});

        return {success:true};
    }catch(e){
        console.error("Create Booking Failed",e);
        return {success:false};
    }
}