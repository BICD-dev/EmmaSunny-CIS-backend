import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string, saltRounds=10): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}