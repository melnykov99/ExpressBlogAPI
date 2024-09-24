import {db} from "./configMongoDB";
import {Collection} from "mongodb";
import {BlogDBModel} from "../types/blogs";
import {PostDBModel} from "../types/posts";

const blogsCollection: Collection<BlogDBModel> = db.collection("blogs");
const postsCollection: Collection<PostDBModel> = db.collection("posts");

export {blogsCollection, postsCollection}