import { useEffect, useState } from "react";

interface UseLocalValuesProps {
  key: string;
}

export const useLocalValues = ({ key }: UseLocalValuesProps) => {
  const [localValues, setLocalValues] = useState<string | null>(null);

  useEffect(() => {
    const localValues = localStorage.getItem(key);
    if (localValues) {
      setLocalValues(JSON.parse(localValues));
    }
  }, [key]);

  const updateLocalValues = (value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
    setLocalValues(value);
  };

  return {
    localValues,
    updateLocalValues,
  };
};
