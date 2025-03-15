import React from 'react';

export const MediaInfo = ({report}) => {
    return(
      <div>
        <div className='flex flex-col place-items-start space-y-2'>
          <div className='text-sm font-semibold text-[#123F7B]/80'>IMAGES</div>
          <div className='flex flex-row flex-wrap space-x-2 w-full'>
          <img src={report.personInvolved.mostRecentPhoto?.url || ''} alt="Most Recent Photo" className="w-[200px] h-[200px] rounded-sm mx-2"></img>
          {report.additionalImages && report.additionalImages.length > 0 ? (
            report.additionalImages.map((image, index) => (
              <img key={index} src={image?.url} alt={`Additional Image ${index + 1}`} className="w-[200px] h-[200px] rounded-sm mx-2" />
            ))
          ) : (
            <p className='mx-2'>No Additional Images</p>
          )}
          </div>
          <div className='text-sm font-semibold text-[#123F7B]/80'>VIDEO</div>
          <div className='flex flex-row space-x-2'>
          {report.video ? (
            <video src={report.video?.url || ''} alt="video" className="w-[400px] h-[400px] rounded-sm mx-2"></video>
          ) : (
            <p className='mx-2'>No Video</p>
          )}
          </div>
        </div>
      </div>
    );
};