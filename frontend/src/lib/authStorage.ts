export const saveRefreshToken = (token: string) => {
  localStorage.setItem('auth_refreshToken', token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('auth_refreshToken');
};

export const removeRefreshToken = () => {
  localStorage.removeItem('auth_refreshToken');
};
