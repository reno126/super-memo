import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (text: string) => R;
      toHaveClass: (className: string) => R;
      toHaveAttribute: (attr: string, value?: string) => R;
      toBeInTheDocument: () => R;
      toHaveStyle: (styles: Record<string, string> | string) => R;
      toBeDisabled: () => R;
    }
  }
}
