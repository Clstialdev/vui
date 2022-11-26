import { type NextPage} from "next";
import {useState, useEffect} from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

type actions = "dislike" | 'like' | 'superLike';

const COLORS = ['red', 'gray', 'pink', 'green', 'blue', 'cyan', 'purple', 'orange'] 
const Tags = ['photography', "typography","design","3d","uiux","fashion"]


const Home: NextPage = () => {
  const vote = trpc.images.vote.useMutation();
  const [tagColors, setTagColors] = useState([]);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([])
  const [selected, setSelected] = useState(false)
  const [currentImage, setCurrentImage] = useState(1)

  let tempTagColors = [];
      const pickColor = (recursiveInstanceNumber:number) => {
        if(recursiveInstanceNumber === 30) {return COLORS[0]}
        let rnd = Math.floor((Math.random() * 10) % COLORS.length)
            if(!tempTagColors.includes(COLORS[rnd])){
               return COLORS[rnd];
            }
            else{
              return pickColor(recursiveInstanceNumber+1);
            }
      }

  
  const assignColors = () => {
    Tags.forEach((tag)=>tempTagColors.push(pickColor(0)));
    setTagColors(tempTagColors)
  }

  useEffect(()=>{
     assignColors();
          },[])


  const handleTagClick = (tag:string) => {
      if(!selectedTags.includes(tag)){
        setSelectedTags((current)=>[...current,tag])
      }
      else{
       let arr = Array.from(selectedTags);
       arr = arr.filter((element)=>element != tag)
       setSelectedTags(arr)
      }

  } 

  const handleAction = async(action:actions) => {
      if(selectedTags.length === 0){ alert('please select a tag'); return 0; }
      
      let dbEntry = {
        id: currentImage.toString(),
        tags: selectedTags,
        vote: action
      }

      console.log(dbEntry);
      const result = await vote.mutate(dbEntry);

      setSelectedTags([]);


   setCurrentImage((current)=> current+1);
  }

  return (
    <>
      <Head>
        <title>Hall Voting Center</title>
        <meta name="description" content="Voting Center" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black"> 
        <div className="flex gap-2">
        {
         Tags.map((tag:string,index:number)=><div key={index} className="text-white py-4 px-6 select-none hover:cursor-pointer" style={{backgroundColor:!selectedTags.includes(tag) ? tagColors[index] : 'black'}} onClick={()=>handleTagClick(tag)}>{tag}</div>) 
        }

        </div>
        {/*Image*/}
         <div className="relative h-[50vh] w-full mt-12">
            <Image src={`/images/${currentImage}.jpg`} layout="fill" objectFit="contain"/>
         </div>

         {/*Action Buttons*/}
         <div className="flex gap-2 flex-wrap mt-8">
           <div className="text-white py-4 px-6 select-none hover:cursor-pointer bg-red-500" onClick={()=>handleAction('dislike')}>Dislike</div>
           <div className="text-white py-4 px-6 select-none hover:cursor-pointer bg-green-400" onClick={()=>handleAction('like')}>Like</div>
           <div className="text-white py-4 px-6 select-none hover:cursor-pointer bg-pink-500" onClick={()=>handleAction('superLike')}>SuperLike</div>
         </div>

         {/*Navigation Buttons*/}
         <div className="flex gap-2 flex-wrap mt-4">
           <div className="text-white py-4 px-6 bg-purple-500 select-none hover:cursor-pointer" onClick={()=>handlePrevious()}>Back</div>
           <div className="text-white py-4 px-6 bg-blue-500 select-none hover:cursor-pointer" onClick={()=>handleNext()}>Next</div>
         </div>
      </main>
    </>
  );
};

export default Home;

