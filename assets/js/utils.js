const utils = {
  parseJwt: (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch { return null; }
  },
  currentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = utils.parseJwt(token);
    if (!payload) return null;
    return { id: Number(payload.sub), is_admin: !!payload.is_admin };
  }
};
