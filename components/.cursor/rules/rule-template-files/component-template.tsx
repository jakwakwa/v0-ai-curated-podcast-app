// component-template.tsx

import React from "react";
// @ts-ignore
import styles from "../component-name.modules.css"; // always use css modules ( never tailwind)

interface ComponentNameProps {
  title: string;
  isVisible?: boolean;
  onClick?: () => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  isVisible = true,
  onClick,
}) => {
  return (
    <div className={styles.componentContainer}>
      {isVisible && <h2 onClick={onClick}>{title}</h2>}
    </div>
  );
};


