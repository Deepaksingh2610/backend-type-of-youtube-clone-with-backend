import mongoose from "mongoose";
import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { createPlaylist, getUserPlaylists } from "../controllers/playlist.controllers.js";


const playlistSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        videos:[
            {
               type:Schema.Types.ObjectId,
               ref:"Video"
        }
    ],
        owners:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },{timestamps:true})



export const Playlist = mongoose.model("Playlist", playlistSchema)