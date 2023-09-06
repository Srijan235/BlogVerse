import { useState } from "react";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import { useEffect } from "react";

const  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };
  
      
  const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
  ];



export default function EditPost(){
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files,setFiles] = useState('');
    const [redirect ,setRedirect] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/post/'+id)
          .then(response => {
            response.json().then(postInfo => {
              setTitle(postInfo.title);
              setContent(postInfo.content);
              setSummary(postInfo.summary);
            });
          });
      }, []);

    async function updatePost(ev){
     ev.preventDefault();
     const data = new FormData();
     data.set('title', title);
     data.set('summary', summary);
     data.set('content', content);
     data.set('id', id);
     if (files?.[0]) {
       data.set('file', files?.[0]);
     }
     const response = await fetch('http://localhost:4000/post', {
       method: 'PUT',
       body: data,
       credentials: 'include',
     });
     if (response.ok) {
       setRedirect(true);
     }


    }

    if(redirect){
        return <Navigate to={'/post/'+id} />
    }


   return(
    <form onSubmit={updatePost}>

    <input type ="title" 
    placeholder={'Title'}
     value={title} 
     onChange={ev=>setTitle(ev.target.value)}></input>

    <input type="summary"
     placeholder={'Summary'}
     onChange={ev=>setSummary(ev.target.value)}
     ></input>

     <input type="file" 
       
       onChange={ev=>setFiles(ev.target.files)}/>
   

     <Editor onChange={setContent} value={content}></Editor>
     {/* <textarea name="" id="" cols='30' rows='10'></textarea> */}

   
     <button style={{marginTop: '5px'}}>Create Post</button>

    </form>
   );

}