import { useEffect, useState } from "react";
import Post from "../post";


export default function IndexPage(){
    
    const [posts,setposts] = useState([]);
 useEffect(()=>{
    fetch('http://localhost:4000/post').then(response=>{
         response.json().then(posts=>{
          //  console.log(posts);
            setposts(posts);
         });
    });
 },[]);
return (
    <div>
     
    {posts.length > 0 && posts.map(post=>( 
        <Post {...post}></Post>
    ))}

    </div>
)

}