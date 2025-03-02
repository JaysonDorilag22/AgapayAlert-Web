export const formatDateToMonthYear = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate.replace(' ', ', ');
  };