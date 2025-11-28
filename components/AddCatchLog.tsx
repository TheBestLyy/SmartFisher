
import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Calendar, Ruler, Weight, FileText, Trash2 } from 'lucide-react';
import { CatchLog } from '../types';

interface AddCatchLogProps {
  onClose: () => void;
  onSave: (log: Omit<CatchLog, 'id'>, id?: string) => void;
  onDelete?: (id: string) => void;
  initialData?: CatchLog | null;
}

const AddCatchLog: React.FC<AddCatchLogProps> = ({ onClose, onSave, onDelete, initialData }) => {
  const [species, setSpecies] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setSpecies(initialData.species);
      setWeight(initialData.weight.toString());
      setLength(initialData.length.toString());
      setLocation(initialData.location);
      setDate(initialData.date);
      setNote(initialData.note);
      setImage(initialData.image || null);
    }
  }, [initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!species) return; // Basic validation
    
    const logData = {
      species,
      weight: parseFloat(weight) || 0,
      length: parseFloat(length) || 0,
      location: location || '未知地点',
      date,
      note,
      image: image || 'https://picsum.photos/400/300?random=' + Math.random() // Fallback image
    };

    onSave(logData, initialData?.id);
    onClose();
  };

  const handleDelete = () => {
      if (initialData?.id && onDelete) {
          if (window.confirm('确定要删除这条鱼获记录吗？此操作无法撤销。')) {
              onDelete(initialData.id);
              onClose();
          }
      }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button onClick={onClose} className="text-slate-600 font-medium p-2 -ml-2">取消</button>
        <h2 className="font-bold text-lg">{initialData ? '编辑鱼获' : '记录鱼获'}</h2>
        <button
          onClick={handleSave}
          disabled={!species}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-50"
        >
          保存
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        {/* Image Upload */}
        <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative active:bg-slate-100 transition-colors"
        >
            {image ? (
                <>
                    <img src={image} alt="Catch" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={32} />
                    </div>
                </>
            ) : (
                <>
                    <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                        <Camera className="text-blue-500" size={24} />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">点击上传鱼获照片</span>
                </>
            )}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <div className="flex items-center border-b border-slate-200 pb-2">
                    <span className="w-20 font-medium text-slate-600">鱼种</span>
                    <input
                        type="text"
                        placeholder="例如：大板鲫"
                        className="flex-1 bg-transparent outline-none font-bold text-slate-900 placeholder-slate-300"
                        value={species}
                        onChange={e => setSpecies(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-4">
                    <div className="flex-1 flex items-center border-b border-slate-200 pb-2">
                         <Weight size={18} className="text-slate-400 mr-2" />
                         <input
                            type="number"
                            placeholder="0.0"
                            className="w-full bg-transparent outline-none font-medium text-slate-900"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                         />
                         <span className="text-xs text-slate-400">kg</span>
                    </div>
                    <div className="flex-1 flex items-center border-b border-slate-200 pb-2">
                         <Ruler size={18} className="text-slate-400 mr-2" />
                         <input
                            type="number"
                            placeholder="0"
                            className="w-full bg-transparent outline-none font-medium text-slate-900"
                            value={length}
                            onChange={e => setLength(e.target.value)}
                         />
                         <span className="text-xs text-slate-400">cm</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <div className="flex items-center">
                    <MapPin size={18} className="text-blue-500 mr-3" />
                    <input
                        type="text"
                        placeholder="钓点位置"
                        className="flex-1 bg-transparent outline-none text-slate-900 text-sm"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                    />
                </div>
                 <div className="flex items-center">
                    <Calendar size={18} className="text-orange-500 mr-3" />
                    <input
                        type="date"
                        className="flex-1 bg-transparent outline-none text-slate-900 text-sm"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start">
                 <FileText size={18} className="text-slate-400 mr-3 mt-1" />
                 <textarea
                    placeholder="备注：天气、饵料、线组等..."
                    className="flex-1 bg-transparent outline-none resize-none min-h-[100px] text-slate-900 text-sm"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                 />
            </div>
            
            {initialData && (
                <button 
                    onClick={handleDelete}
                    className="w-full py-3 rounded-xl border border-red-200 text-red-500 font-medium flex items-center justify-center active:bg-red-50"
                >
                    <Trash2 size={18} className="mr-2" />
                    删除此记录
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddCatchLog;
