
export const getStatusTable  = (status) => {
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