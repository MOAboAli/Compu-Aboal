import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { catalogApi } from '../shared/api';

const CmsContext = createContext({
  cms: null,
  loading: true,
  reload: async () => {},
  text: () => '',
});

function isArabic(lang) {
  return String(lang || '').toLowerCase().startsWith('ar');
}

export function CmsProvider({ children }) {
  const [cms, setCms] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  async function reload() {
    setLoading(true);
    try {
      const data = await catalogApi.cms();
      setCms(data);
    } catch {
      setCms(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  const value = useMemo(() => {
    function text(enKey, arKey, fallback = '') {
      if (isArabic(i18n.language)) {
        return cms?.[arKey] || cms?.[enKey] || fallback;
      }
      return cms?.[enKey] || fallback;
    }

    function nested(group, enKey, arKey, fallback = '') {
      const obj = cms?.[group] || {};
      if (isArabic(i18n.language)) {
        return obj[arKey] || obj[enKey] || fallback;
      }
      return obj[enKey] || fallback;
    }

    return { cms, loading, reload, text, nested, isArabic: isArabic(i18n.language) };
  }, [cms, loading, i18n.language]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}
