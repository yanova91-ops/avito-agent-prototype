/// <reference types="vite/client" />

declare module '@avito/i18n-react' {
  import type { PropsWithChildren, ReactElement } from 'react';

  export function I18nProvider(
    props: PropsWithChildren<{
      locale: string;
      defaultLocale?: string;
      messages?: Record<string, string>;
    }>,
  ): ReactElement;
}
