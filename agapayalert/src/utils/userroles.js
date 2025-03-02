export const getRoleDisplayName = (role) => {
    switch (role) {
      case 'user':
        return 'Reportee';
      case 'police_officer':
        return 'Police Officer';
      case 'police_admin':
        return 'Police Admin';
      case 'city_admin':
        return 'City Admin';
      case 'super_admin':
        return 'Super Admin';
      default:
        return 'Unknown Role';
    }
  };