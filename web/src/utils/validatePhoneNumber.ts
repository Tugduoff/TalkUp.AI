export const validatePhoneNumber = async (phoneNumber: string) => {
  return new Promise<string | undefined>((resolve) => {
    setTimeout(() => {
      resolve(phoneNumber.includes('69') ? undefined : 'Invalid phone number');
    }, 100);
  });
};
