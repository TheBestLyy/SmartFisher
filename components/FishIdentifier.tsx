import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, AlertTriangle, CheckCircle, ChefHat, Info } from 'lucide-react';
import { identifyFish, fileToGenerativePart } from '../services/geminiService';
import { FishAnalysisResult } from '../types';

const FishIdentifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FishAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setLoading(true);
        setError(null);
        setResult(null);
        
        // Display preview immediately
        const base64Data = await fileToGenerativePart(file);
        const mimeType = file.type;
        setImage(`data:${mimeType};base64,${base64Data}`);

        // Call AI
        const analysis = await identifyFish(base64Data, mimeType);
        setResult(analysis);
      } catch (err) {
        setError("无法识别该图片，请确保网络通畅并重新尝试。");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 px-4 pt-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">AI 慧眼识鱼</h1>
      <p className="text-slate-500 text-sm mb-6">上传或拍摄鱼获照片，AI 帮您快速鉴定。</p>

      {/* Upload Area */}
      {!image ? (
        <div 
            onClick={triggerCamera}
            className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
        >
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Camera className="text-blue-600" size={32} />
          </div>
          <span className="text-blue-600 font-medium">点击拍照或上传图片</span>
          <span className="text-blue-400 text-xs mt-2">支持 JPG, PNG 格式</span>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
          <img src={image} alt="Uploaded fish" className="w-full h-64 object-cover" />
          <button 
            onClick={() => { setImage(null); setResult(null); }}
            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-sm"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      )}

      {/* Hidden Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Loading State */}
      {loading && (
        <div className="mt-8 flex flex-col items-center animate-pulse">
            <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
            <div className="h-2 w-3/4 bg-slate-200 rounded mb-2"></div>
            <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
            <p className="text-sm text-slate-500 mt-4">正在分析鱼种特征...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center border border-red-100">
            <AlertTriangle className="mr-3 flex-shrink-0" />
            <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Result Card */}
      {result && !loading && (
        <div className="mt-6 space-y-4 animate-fade-in-up">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">{result.name}</h2>
                    {result.isProtected && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold border border-red-200">
                            保护物种
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500 italic mb-4">{result.scientificName}</p>
                
                <div className="space-y-4">
                    <div className="flex items-start">
                        <Info className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" size={18} />
                        <p className="text-sm text-slate-700 leading-relaxed">{result.description}</p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <div className="flex items-center mb-2 text-orange-700 font-semibold">
                            <ChefHat className="mr-2" size={18} />
                            <span>食用建议</span>
                        </div>
                        <p className="text-sm text-slate-700">{result.edibility}</p>
                    </div>
                </div>
            </div>
            
            {result.isProtected ? (
                <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500 flex items-start">
                    <AlertTriangle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                    <div className="text-sm text-red-700">
                        <p className="font-bold">请立即放流！</p>
                        <p>该鱼种可能属于国家或地区保护动物，捕捞可能违法。</p>
                    </div>
                </div>
            ) : (
                <button 
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                    onClick={() => alert("功能开发中：已将此条鱼获保存到您的鱼护日记！")}
                >
                    <div className="flex items-center justify-center">
                        <CheckCircle className="mr-2" size={20} />
                        记入鱼护
                    </div>
                </button>
            )}
        </div>
      )}
    </div>
  );
};

export default FishIdentifier;