// src/components/PageTitle.tsx
import React from "react";
import type { PageTitleProps } from "../type";

const PageTitle = ({ title }: PageTitleProps) => {
  return <h1>{title}</h1>;
};

export default PageTitle;
