import React from "react";
import { GoClock } from "react-icons/go";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from './../ui/accordion';

export const FinderInfo = ({finderReports}) => {

    const getStatusTable  = (status) => {
        switch (status) {
            case 'Pending':
                return (
                    <div className='bg-[#FBBC05]/10 px-2 py-2 rounded-full'>
                          <p className='text-[#FBBC05] text-xs font-semibold text-center'>{status}</p>
                    </div>
                );
            case 'Assigned':
                return (
                    <div className='bg-[#123F7B]/10 px-2 py-2 rounded-full'>
                          <p className='text-[#123F7B] text-xs font-semibold text-center'>{status}</p>
                    </div>
                );
            case 'Under Investigation':
                return (
                    <div className='bg-[#123F7B] px-2 py-2 rounded-full'>
                        <p className='text-white text-xs font-semibold text-center'>{status}</p>
                    </div>
                );
            case 'Resolved':
                return (
                    <div className='bg-[#34A853]/10 px-2 py-2 rounded-full'>
                        <p className='text-[#34A853] text-xs font-semibold text-center'>{status}</p>
                    </div>
                );
        }
      };

      const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleString('en-US', options).replace(',', ',');
    };

    return (
        <div>
            <div className='flex flex-col w-full place-items-center p-4'>
                <Accordion type="single" collapsible className='w-full space-y-1'>
                {finderReports.finderReports && finderReports.finderReports.length > 0 ? (
                    finderReports.finderReports.map((report, index) => (
                        <AccordionItem key={index} value={`item-${index + 1}`} className='w-full hover:bg-[#123F7B]/10 hover:rounded-xl'>
                        <AccordionTrigger className='flex flex-row place-items-center justify-between w-full border border-[#123F7B] px-2 py-1 rounded-xl'>
                            <div className='flex flex-col place-items-start justify-start -space-y-0'>
                            <p className='text-[#123F7B] text-xs font-semibold'>{report.finder.firstName} {report.finder.lastName}</p>
                            <p className='text-[#D46A79] text-[10px] font-light'>{formatDateTime(report.finder.createdAt)}</p>
                            </div>
                            <div className='flex flex-col place-items-end justify-end'>
                                {getStatusTable(report.status)}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className='w-full border border-[#123F7B] px-2 py-1 rounded-xl'>
                            <div className="flex flex-row justify-start w-full gap-8">
                            <div className='flex flex-col'>
                                <div className='flex flex-row place-items-start items-start mt-2'>
                                    <GoClock className="mr-2 text-lg" />
                                    <div className='flex flex-col gap-0'>
                                        <div className='text-xs font-semibold text-[#123F7B] '>{formatDateTime(report.discoveryDetails.dateAndTime)}</div>
                                        <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Time & Date Discovered</div>
                                    </div>
                                </div>
                                <div className='flex flex-row place-items-start items-start mt-2'>
                                    <GoClock className="mr-2 text-lg" />
                                    <div className='flex flex-col gap-0'>
                                        <div className='text-xs font-semibold text-[#123F7B] '>{report.personCondition.physicalCondition}</div>
                                        <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Physical Condition</div>
                                    </div>
                                </div>
                                <div className='flex flex-row place-items-start items-start mt-2'>
                                    <GoClock className="mr-2 text-lg" />
                                    <div className='flex flex-col gap-0'>
                                        <div className='text-xs font-semibold text-[#123F7B] '>{report.personCondition.emotionalState}</div>
                                        <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Emotional Condition</div>
                                    </div>
                                </div>
                                <div className='flex flex-row place-items-start items-start mt-2'>
                                    <GoClock className="mr-2 text-lg" />
                                    <div className='flex flex-col gap-0'>
                                        <div className='text-xs font-semibold text-[#123F7B] '>{report.authoritiesNotified ? 'Yes' : 'No'}</div>
                                        <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Authorities Notified</div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                {report.images && report.images.length > 0 && (
                                    <div className='flex flex-col'>
                                        <p className='text-[#123F7B] text-sm font-semibold'>Images</p>
                                        <div className='flex flex-row flex-wrap space-x-2 mt-2 pl-2'> 
                                            {report.images.map((image, index) => (
                                                <img key={index} src={image?.url} alt={`Finder Report Image ${index + 1}`} className='w-16 h-16 rounded-lg mr-2' />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            </div>
                        </AccordionContent>
                        </AccordionItem>
                    ))): (
                        <p className='text-[#123F7B] text-md font-semibold'>No Finder Reports</p>
                    )
                    }
                </Accordion>
            </div>
        </div>
    );
}