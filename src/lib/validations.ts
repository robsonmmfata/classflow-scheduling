import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido');

export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/(?=.*[a-z])/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/(?=.*[A-Z])/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/(?=.*\d)/, 'Senha deve conter pelo menos um número');

export const nameSchema = z
  .string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(50, 'Nome deve ter no máximo 50 caracteres')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras');

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

// Settings schemas
export const settingsSchema = z.object({
  displayName: nameSchema,
  phone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Formato de telefone inválido'),
});

// Profile schemas
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  nationality: z.string().min(1, 'Nacionalidade é obrigatória'),
  languages: z.string().optional(),
});

// Schedule schemas
export const scheduleSchema = z.object({
  startTime: z.string().min(1, 'Horário de início é obrigatório'),
  endTime: z.string().min(1, 'Horário de fim é obrigatório'),
});

export const fixedScheduleSchema = z.object({
  dayOfWeek: z.string().min(1, 'Dia da semana é obrigatório'),
  time: z.string().min(1, 'Horário é obrigatório'),
});

// Pricing schemas
export const pricingSchema = z.object({
  trialPrice: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  package4Price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  package8Price: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
  quarterlyPrice: z.number().min(0, 'Preço deve ser maior ou igual a 0'),
});

// Feedback schemas
export const feedbackSchema = z.object({
  rating: z.number().min(1, 'Avaliação é obrigatória').max(5, 'Avaliação deve ser entre 1 e 5'),
  comment: z.string()
    .min(20, 'Comentário deve ter pelo menos 20 caracteres')
    .max(500, 'Comentário deve ter no máximo 500 caracteres'),
});

// Material upload schemas
export const materialSchema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
});

// Types for form validation
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type SettingsForm = z.infer<typeof settingsSchema>;
export type ProfileForm = z.infer<typeof profileSchema>;
export type ScheduleForm = z.infer<typeof scheduleSchema>;
export type FixedScheduleForm = z.infer<typeof fixedScheduleSchema>;
export type PricingForm = z.infer<typeof pricingSchema>;
export type FeedbackForm = z.infer<typeof feedbackSchema>;
export type MaterialForm = z.infer<typeof materialSchema>;

// Validation helper function
export const validateField = <T>(schema: z.ZodSchema<T>, data: T): { success: boolean; error?: string } => {
  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Erro de validação' };
    }
    return { success: false, error: 'Erro de validação' };
  }
};

// Real-time validation hook helper
export const createFieldValidator = <T>(schema: z.ZodSchema<T>) => {
  return (value: T) => {
    const result = validateField(schema, value);
    return result.error || null;
  };
};