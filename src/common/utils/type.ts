import { ZodTypeAny, z } from 'zod';

// 将键值对的键名转化为枚举约束
export function zodEnumFromObjKeys<K extends string>(
  obj: Record<K, any>
): z.ZodEnum<[K, ...K[]]> {
  const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
  return z.enum([firstKey, ...otherKeys]);
}

export function zodSafeString(defaultValue = '') {
  return z
    .string()
    .nullable()
    .optional()
    .transform((t) => t || defaultValue);
}

export function zodSafeBoolean(defaultValue = false) {
  return z
    .boolean()
    .nullable()
    .optional()
    .transform((t) => (typeof t === 'boolean' ? t : defaultValue));
}

export function zodSafeNumber(defaultValue = 0) {
  return z
    .number()
    .nullable()
    .optional()
    .transform((t) => (typeof t === 'number' ? t : defaultValue));
}

export function zodSafeArray<T extends ZodTypeAny>(
  schema: T,
  defaultValue = []
) {
  return z
    .array(schema)
    .nullable()
    .optional()
    .transform((t) => t || defaultValue);
}

export function zodSafeType<T extends ZodTypeAny>(
  schema: T,
  defaultValue?: z.infer<T>
) {
  const defaultValueFixed: z.infer<T> = schema.parse(defaultValue || {});
  return schema
    .nullable()
    .optional()
    .transform((t) => t || defaultValueFixed);
}
