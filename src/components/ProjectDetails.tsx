import { GoDotFill } from "react-icons/go";
import {IoMdAdd} from "react-icons/io";
import { Badge } from "./ui/badge";
import { BsThreeDots } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
const ProjectDetails = () => {
  return (
    <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className=" h-[660px] w-[400px] bg-secondary rounded-lg flex flex-col gap-4  px-4 py-3">
           <div className=" flex w-full justify-between py-3">
             <div className=" flex gap-2 items-center">
                <GoDotFill className=" text-light-1"/>
                <p className=" text-dark">To Do</p>
                <p className=" bg-secondary-2 w-5 h-5 rounded-full flex items-center justify-center">
                    <span className=" text-dark text-sm">4</span>
                </p>
             </div>
              <p className=" cursor-pointer bg-secondary-2 w-6 h-6 rounded-lg flex items-center justify-center">
                <IoMdAdd className=" text-light-1" size={20}/>
              </p>
           </div>
           <div>
             <hr  className=" bg-light-1 h-1 w-full"/>
           </div>
           {/* Cards */}
           <div className=" w-full h-[195px] bg-white rounded-lg px-3 py-4 shadow-lg ">
            <div className=" flex flex-col space-y-4">
                <div className=" w-full flex flex-col gap-2">
                    <div className=" flex justify-between w-full">
                        <Badge variant="outline" className=" text-sm text-orange-500 bg-[#DFA874] font-thin">LOW</Badge>
                        <BsThreeDots/>
                        
                    </div>
                    <h3 className=" font-semibold text-dark">Brainstorming</h3>
                    <p className=" text-primary text-sm">Brainstorming brings team members' diverse experience into play. </p>
                </div> 
                    {/* people, comments,files */}
                    <div className=" flex justify-between w-full">
                       <div className="flex -space-x-4">
                            {/* First Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 1" />
                                <AvatarFallback>AB</AvatarFallback>
                            </Avatar>

                            {/* Second Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 2" />
                                <AvatarFallback>CD</AvatarFallback>
                            </Avatar>

                            {/* Third Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 3" />
                                <AvatarFallback>EF</AvatarFallback>
                            </Avatar>

    
                         </div>

                         <div className=" flex gap-3">
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/comment.svg" 
                              alt="comment"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">12 comments</p>
                            </div>
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/file.svg" 
                              alt="file"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">0 files</p>
                            </div>
                            <div>

                            </div>
 
                         </div>

                    </div>
            </div> 
           </div>
           <div className=" w-full h-[195px] bg-white rounded-lg px-3 py-4 shadow-lg ">
            <div className=" flex flex-col space-y-4">
                <div className=" w-full flex flex-col gap-2">
                    <div className=" flex justify-between w-full">
                        <Badge variant="outline" className=" text-sm text-orange-500 bg-[#DFA874] font-thin">LOW</Badge>
                        <BsThreeDots/>
                        
                    </div>
                    <h3 className=" font-semibold text-dark">Brainstorming</h3>
                    <p className=" text-primary text-sm">Brainstorming brings team members' diverse experience into play. </p>
                </div> 
                    {/* people, comments,files */}
                    <div className=" flex justify-between w-full">
                       <div className="flex -space-x-4">
                            {/* First Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 1" />
                                <AvatarFallback>AB</AvatarFallback>
                            </Avatar>

                            {/* Second Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 2" />
                                <AvatarFallback>CD</AvatarFallback>
                            </Avatar>

                            {/* Third Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 3" />
                                <AvatarFallback>EF</AvatarFallback>
                            </Avatar>

    
                         </div>

                         <div className=" flex gap-3">
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/comment.svg" 
                              alt="comment"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">12 comments</p>
                            </div>
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/file.svg" 
                              alt="file"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">0 files</p>
                            </div>
                            <div>

                            </div>
 
                         </div>

                    </div>
            </div> 
           </div>
           <div className=" w-full h-[195px] bg-white rounded-lg px-3 py-4 shadow-lg">
            <div className=" flex flex-col space-y-4">
                <div className=" w-full flex flex-col gap-2">
                    <div className=" flex justify-between w-full">
                        <Badge variant="outline" className=" text-sm text-orange-500 bg-[#DFA874] font-thin">LOW</Badge>
                        <BsThreeDots/>
                        
                    </div>
                    <h3 className=" font-semibold text-dark">Brainstorming</h3>
                    <p className=" text-primary text-sm">Brainstorming brings team members' diverse experience into play. </p>
                </div> 
                    {/* people, comments,files */}
                    <div className=" flex justify-between w-full">
                       <div className="flex -space-x-4">
                            {/* First Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 1" />
                                <AvatarFallback>AB</AvatarFallback>
                            </Avatar>

                            {/* Second Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 2" />
                                <AvatarFallback>CD</AvatarFallback>
                            </Avatar>

                            {/* Third Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 3" />
                                <AvatarFallback>EF</AvatarFallback>
                            </Avatar>

    
                         </div>

                         <div className=" flex gap-3">
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/comment.svg" 
                              alt="comment"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">12 comments</p>
                            </div>
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/file.svg" 
                              alt="file"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">0 files</p>
                            </div>
                            <div>

                            </div>
 
                         </div>

                    </div>
            </div> 
           </div>
        </div>
        <div className=" h-[660px] w-[400px] bg-secondary rounded-lg flex flex-col gap-4  px-4 py-3">
            <div className=" flex w-full justify-between py-3">
                <div className=" flex gap-2 items-center">
                    <GoDotFill className=" text-orange-500"/>
                    <p className=" text-dark">On Progress</p>
                    <p className=" bg-secondary-2 w-5 h-5 rounded-full flex items-center justify-center">
                        <span className=" text-dark text-sm">3</span>
                    </p>
                </div>
                <p className=" cursor-pointer bg-secondary-2 w-6 h-6 rounded-lg flex items-center justify-center">
                    <IoMdAdd className=" text-light-1" size={20}/>
                </p>
            </div>
            <div>
               <hr  className=" bg-orange-500 h-1 w-full"/>

            </div>

            <div className="w-full h-[258px] bg-white rounded-lg px-3 py-4 shadow-lg">
                <div className=" flex flex-col space-y-4">
                    <div className=" w-full flex flex-col gap-2">
                            <div className=" flex justify-between w-full">
                                <Badge variant="outline" className=" text-sm text-orange-500 bg-[#DFA874] font-thin">LOW</Badge>
                                <BsThreeDots/>
                                
                            </div>
                            <h3 className=" font-semibold text-dark">Onboarding Illustrations</h3>
                            <img 
                              src="/assets/image/card-image-1.jpg" 
                              alt="image 1" />
                        </div> 

                        {/* people, comments,files */}
                    <div className=" flex justify-between w-full">
                       <div className="flex -space-x-4">
                            {/* First Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 1" />
                                <AvatarFallback>AB</AvatarFallback>
                            </Avatar>

                            {/* Second Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 2" />
                                <AvatarFallback>CD</AvatarFallback>
                            </Avatar>

                            {/* Third Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 3" />
                                <AvatarFallback>EF</AvatarFallback>
                            </Avatar>

    
                         </div>

                         <div className=" flex gap-3">
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/comment.svg" 
                              alt="comment"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">14 comments</p>
                            </div>
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/file.svg" 
                              alt="file"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">15 files</p>
                            </div>
                            <div>

                            </div>
 
                         </div>

                    </div>
                    </div>
            </div>
            <div className="w-full h-[258px] bg-white rounded-lg px-3 py-4 shadow-lg">
                <div className=" flex flex-col space-y-4">
                    <div className=" w-full flex flex-col gap-2">
                            <div className=" flex justify-between w-full">
                                <Badge variant="outline" className=" text-sm text-orange-500 bg-[#DFA874] font-thin">LOW</Badge>
                                <BsThreeDots/>
                                
                            </div>
                            <h3 className=" font-semibold text-dark">Moodboard</h3>
                            <div className=" flex justify-between">
                                <img 
                                src="/assets/image/card-image-2.jpg" 
                                alt="image 1"
                                width={160}
                                height={79}
                                />
                                 <img 
                                src="/assets/image/card-image-3.jpg" 
                                alt="image 1"
                                width={160}
                                height={79}
                                />
                            </div>  
                        </div> 

                        {/* people, comments,files */}
                    <div className=" flex justify-between w-full">
                       <div className="flex -space-x-4">
                            {/* First Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 1" />
                                <AvatarFallback>AB</AvatarFallback>
                            </Avatar>


    
                         </div>

                         <div className=" flex gap-3">
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/comment.svg" 
                              alt="comment"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">9 comments</p>
                            </div>
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/file.svg" 
                              alt="file"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">10 files</p>
                            </div>
                            <div>

                            </div>
 
                         </div>

                    </div>
                    </div>
            </div>

        </div>
        <div className=" h-[660px] w-[400px] bg-secondary rounded-lg flex flex-col gap-4  px-4 py-3">
            <div className=" flex w-full justify-between py-3">
                <div className=" flex gap-2 items-center">
                    <GoDotFill className=" text-blue-400"/>
                    <p className=" text-dark">Done</p>
                    <p className=" bg-secondary-2 w-5 h-5 rounded-full flex items-center justify-center">
                        <span className=" text-dark text-sm">2</span>
                    </p>
                </div>
                <p className=" cursor-pointer bg-secondary-2 w-6 h-6 rounded-lg flex items-center justify-center">
                    <IoMdAdd className=" text-light-1" size={20}/>
                </p>
            </div>
            <div>

               <hr  className=" bg-green-600 h-1 w-full"/>
             
            </div>

            <div className="w-full h-[400px] bg-white rounded-lg px-3 py-4 shadow-lg">
                <div className=" flex flex-col space-y-4">
                    <div className=" w-full flex flex-col gap-2">
                            <div className=" flex justify-between w-full">
                                <Badge variant="outline" className=" text-sm text-[#68B266] bg-[#83C29D] font-thin">Completed</Badge>
                                <BsThreeDots/>
                                
                            </div>
                            <h3 className=" font-semibold text-dark">Mobile App Design</h3>
                            <img 
                              src="/assets/image/card-image-4.jpg" 
                              alt="image 1" />
                        </div> 

                        {/* people, comments,files */}
                    <div className=" flex justify-between w-full">
                       <div className="flex -space-x-4">
                            {/* First Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 1" />
                                <AvatarFallback>AB</AvatarFallback>
                            </Avatar>

                            {/* Second Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 2" />
                                <AvatarFallback>CD</AvatarFallback>
                            </Avatar>

                         

    
                         </div>

                         <div className=" flex gap-3">
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/comment.svg" 
                              alt="comment"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">12 comments</p>
                            </div>
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/file.svg" 
                              alt="file"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">15 files</p>
                            </div>
                            <div>

                            </div>
 
                         </div>

                    </div>
                    </div>
            </div>
            <div className="w-full h-[195px] bg-white rounded-lg px-3 py-4 shadow-lg">
                <div className=" flex flex-col space-y-4">
                    <div className=" w-full flex flex-col gap-2">
                            <div className=" flex justify-between w-full">
                                <Badge variant="outline" className=" text-sm text-[#68B266] bg-[#83C29D] font-thin">Completed</Badge>
                                <BsThreeDots/>
                                
                            </div>
                            <h3 className=" font-semibold text-dark">Design system</h3>
                           <p className="text-primary text-sm">It just needs to adapt the UI from what you did before </p>
                        </div> 

                        {/* people, comments,files */}
                    <div className=" flex justify-between w-full">
                       <div className="flex -space-x-4">
                            {/* First Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 1" />
                                <AvatarFallback>AB</AvatarFallback>
                            </Avatar>

                            {/* Second Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 2" />
                                <AvatarFallback>CD</AvatarFallback>
                            </Avatar>

                            {/* Third Avatar */}
                            <Avatar className="w-6 h-6 border-2 border-white">
                                <AvatarImage src="/assets/image/profile.jpg" alt="User 3" />
                                <AvatarFallback>EF</AvatarFallback>
                            </Avatar>

    
                         </div>

                         <div className=" flex gap-3">
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/comment.svg" 
                              alt="comment"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">14 comments</p>
                            </div>
                            <div className=" flex gap-1 items-center">
                            <img 
                              src="/assets/icons/file.svg" 
                              alt="file"
                              width={16}
                              height={16}
                              />
                              <p className="text-primary text-xs">15 files</p>
                            </div>
                            <div>

                            </div>
 
                         </div>

                    </div>
                    </div>
            </div>

        </div>
      
    </div>
  )
}

export default ProjectDetails
