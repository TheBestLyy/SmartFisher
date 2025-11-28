
import React, { useState, useRef } from 'react';
import { Camera, X, Check, Image as ImageIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ profile, onClose, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [bgImage, setBgImage] = useState(profile.bgImage);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFunction: (val: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setFunction(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      name,
      bio,
      avatar,
      bgImage
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-600">
            <X size={24} />
        </button>
        <h2 className="font-bold text-lg">编辑个人资料</h2>
        <button 
            onClick={handleSave}
            className="p-2 -mr-2 text-blue-600 font-bold"
        >
            <Check size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
          {/* Background Image Editor */}
          <div className="relative h-48 w-full bg-slate-100 group cursor-pointer" onClick={() => bgInputRef.current?.click()}>
              <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="bg-black/50 p-2 rounded-full text-white">
                      <ImageIcon size={24} />
                  </div>
              </div>
              <input 
                  type="file" 
                  ref={bgInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setBgImage)}
              />
          </div>

          {/* Avatar Editor */}
          <div className="px-4 -mt-10 relative mb-6">
              <div 
                className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 relative group cursor-pointer"
                onClick={() => avatarInputRef.current?.click()}
              >
                  <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <Camera size={24} className="text-white drop-shadow-md" />
                  </div>
              </div>
              <span className="text-xs text-slate-400 mt-2 block text-center w-24">点击修改头像</span>
              <input 
                  type="file" 
                  ref={avatarInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setAvatar)}
              />
          </div>

          {/* Form Fields */}
          <div className="px-4 space-y-6">
              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">昵称</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-slate-200 py-2 outline-none focus:border-blue-500 transition-colors text-slate-900 font-medium"
                    placeholder="请输入昵称"
                  />
              </div>

              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">个性签名</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors text-slate-900 text-sm min-h-[120px] resize-none"
                    placeholder="介绍一下自己，让更多钓友认识你..."
                  />
              </div>
          </div>
      </div>
    </div>
  );
};

export default EditProfile;
