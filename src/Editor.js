import { useState } from "react";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { Navigate } from "react-router-dom";

export default function Editor({value,onChange}){
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

        
return (

    <ReactQuill 
    value={value} 
    modules={modules} 
    formats={formats}
    theme={'snow'}
     onChange={onChange}>
    </ReactQuill>


);


}