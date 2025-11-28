
import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, MapPin, Hash, Video as VideoIcon, PlayCircle } from 'lucide-react';
import { fileToGenerativePart } from '../services/geminiService';

interface CreatePostProps {
  onBack: () => void;
  onPost: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onBack, onPost }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        // Clear video if images are selected
        if (video) setVideo(null);

        // Limit to 9 images
        if (images.length >= 9) return;
        
        const file = e.target.files[0];
        try {
            const base64Data = await fileToGenerativePart(file);
            const mimeType = file.type;
            const fullUrl = `data:${mimeType};base64,${base64Data}`;
            setImages([...images, fullUrl]);
        } catch (error) {
            console.error("Image upload failed", error);
        }
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // Clear images if video is selected
          setImages([]);
          
          const url = URL.createObjectURL(file);
          setVideo(url);
      }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const removeVideo = () => {
      setVideo(null);
      if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
        if (!tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
        }
        setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const toggleLocation = () => {
    if (location) {
        setLocation(null);
    } else {
        // Mock location fetching
        setLocation('杭州·余杭区');
    }
  };

  const handlePublish = () => {
    if (!content.trim() && images.length === 0 && !video) return;
    // In a real app, this would send data to backend
    onPost();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col z-50 absolute top-0 left-0 w-full">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="text-slate-600 p-2 -ml-2">
            <span className="text-base font-medium">取消</span>
        </button>
        <h2 className="font-bold text-lg">发布动态</h2>
        <button 
            onClick={handlePublish}
            disabled={!content.trim() && images.length === 0 && !video}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
            发布
        </button>
      </div>

      {/* Content Input */}
      <div className="flex-1 overflow-y-auto">
        <textarea
            className="w-full p-4 text-lg placeholder-slate-400 outline-none resize-none min-h-[150px]"
            placeholder="分享今天的鱼获、经验或趣事..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
        />

        {/* Media Preview Area */}
        <div className="px-4 pb-4">
            
            {/* Video Preview */}
            {video && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-4 group">
                    <video src={video} className="w-full h-full object-contain" controls />
                    <button 
                        onClick={removeVideo}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Image Grid */}
            {!video && (
                <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                            <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-100"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    
                    {images.length < 9 && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                            <ImageIcon size={24} className="mb-1" />
                            <span className="text-xs">图片</span>
                        </button>
                    )}
                     {images.length === 0 && (
                        <button 
                            onClick={() => videoInputRef.current?.click()}
                            className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                            <VideoIcon size={24} className="mb-1" />
                            <span className="text-xs">视频</span>
                        </button>
                    )}
                </div>
            )}
            
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
            />
             <input 
                type="file" 
                ref={videoInputRef} 
                className="hidden" 
                accept="video/*"
                onChange={handleVideoUpload}
            />
        </div>

        {/* Action Cells */}
        <div className="border-t border-slate-100">
            {/* Location */}
            <div 
                onClick={toggleLocation}
                className="flex items-center px-4 py-4 border-b border-slate-50 active:bg-slate-50 cursor-pointer"
            >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <MapPin size={18} className="text-blue-500" />
                </div>
                <div className="flex-1 text-sm font-medium text-slate-700">
                    {location ? location : "所在位置"}
                </div>
                {location && (
                    <button onClick={(e) => { e.stopPropagation(); setLocation(null); }}>
                        <X size={16} className="text-slate-400" />
                    </button>
                )}
            </div>

            {/* Tags */}
            <div className="px-4 py-4 border-b border-slate-50">
                 <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3 flex-shrink-0">
                        <Hash size={18} className="text-purple-500" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="添加话题 (回车添加)" 
                        className="flex-1 outline-none text-sm bg-transparent"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                    />
                 </div>
                 
                 {tags.length > 0 && (
                     <div className="flex flex-wrap gap-2 pl-11">
                         {tags.map(tag => (
                             <span key={tag} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs flex items-center">
                                 #{tag}
                                 <button onClick={() => removeTag(tag)} className="ml-1">
                                     <X size={10} />
                                 </button>
                             </span>
                         ))}
                     </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
