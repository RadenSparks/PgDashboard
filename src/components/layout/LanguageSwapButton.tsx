import { Button } from "../ui/button";
import React from "react";

export function LanguageSwapButton() {
  const [language, setLanguage] = React.useState("English");

  const handleLanguageChange = () => {
    const newLanguage = language === "English" ? "Vietnamese" : "English";
    setLanguage(newLanguage);
    console.log(`Language swapped to: ${newLanguage}`);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLanguageChange}>
      {language}
    </Button>
  );
}
  