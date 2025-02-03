export const extractUniqueValues = (reports, key) => {
    const uniqueValues = new Set();
    reports.forEach(report => {
      if (report[key]) {
        uniqueValues.add(report[key]);
      }
    });
    return Array.from(uniqueValues);
  };