import * as React from 'react';
import type { FormContextValue, FormItemContextValue } from './types';

export const FormContext = React.createContext<FormContextValue | null>(null);
export const FormItemContext = React.createContext<FormItemContextValue | null>(
  null,
);

export function useFormContext() {
  return (
    React.useContext(FormContext) ?? {
      layout: 'vertical',
      requiredMark: true,
      size: 'middle',
    }
  );
}

export function useFormItemContext() {
  const context = React.useContext(FormItemContext);

  if (!context) {
    throw new Error('Form field components must be used inside Form.Item');
  }

  return context;
}
