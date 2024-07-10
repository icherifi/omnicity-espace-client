import React from 'react';

const DownloadSection: React.FC = () => {
  return (
    <>
      <div className="p-3 text-lg underline bg-slate-200">
        Estimation <span className="font-extralight">(</span>
        <span className="font-extralight underline">pdf/ excel)</span>
      </div>
      <div className="p-3 text-lg underline bg-slate-200">
        Image 3D <span className="font-extralight">(</span>
        <span className="font-extralight underline">pdf/ jpg/ glb)</span>
      </div>
      <div className="p-3 text-lg underline bg-slate-200">
        Modèle 3D <span className="font-extralight">(</span>
        <span className="font-extralight underline">Fbx/ dxf)</span>
      </div>
      <div className="p-3 text-lg underline bg-slate-200">
        Pan 2D <span className="font-extralight">(</span>
        <span className="font-extralight underline">pdf/ jpg)</span>
      </div>
    </>
  );
};

export default DownloadSection;