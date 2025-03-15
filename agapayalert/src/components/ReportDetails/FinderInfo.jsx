import React from "react";
import { GoClock } from "react-icons/go";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from './../ui/accordion';

export const FinderInfo = ({finderReports}) => {
    return (
        <div>
            <div className='flex flex-col w-full place-items-center p-4'>
                <Accordion type="single" collapsible className='w-full space-y-1'>
                {finderReports.finderReports && finderReports.finderReports.length > 0 ? (
                    finderReports.finderReports.map((report, index) => (
                        <AccordionItem key={index} value={`item-${index + 1}`} className='w-full hover:bg-[#123F7B]/10 hover:rounded-xl'>
                        <AccordionTrigger className='flex flex-row place-items-center justify-between w-full border border-[#123F7B] px-2 py-1 rounded-xl'>
                            <div className='flex flex-col place-items-start justify-start -space-y-1'>
                            <p className='text-[#123F7B] text-xs font-semibold'>{report.finder.firstName} {report.finder.lastName}</p>
                            <p className='text-[#D46A79] text-[10px] font-light'>yes yes fufu</p>
                            </div>
                            <div className='flex flex-col place-items-end justify-end'>
                            <GoClock className='text-[#123F7B] text-xl font-light' />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col place-items-center p-4">
                            {report.status}
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