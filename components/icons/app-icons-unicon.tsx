import * as React from "react";

import { useTheme } from "../layout";
import {
  UilPuzzlePiece,
  UilIllustration,
  UilFlask,
  UilRulerCombined,
  UilComparison,
  UilBuilding,
  UilCommentChartLine,
} from "@iconscout/react-unicons";


// Convert tailwind to css modules
import styles from "./app-icons-unicon.module.css";

export const IconOptions = {

  Strategy: (props: IconProps) => (
    <UilPuzzlePiece width={props.options.size} height={props.options.size} color={props.options.color} />
  ),
  Design: (props: IconProps) => (
    <UilIllustration width={props.options.size} height={props.options.size} color={props.options.color} />
  ),
  Research: (props: IconProps) => (
    <UilFlask width={props.options.size} height={props.options.size} color={props.options.color} />
  ),
  Technical: (props: IconProps) => (
    <UilRulerCombined width={props.options.size} height={props.options.size} color={props.options.color} />
  ),
  Org: (props: IconProps) => (
    <UilBuilding width={props.options.size} height={props.options.size} color={props.options.color} />
  ),
  Entrepreneur: (props: IconProps) => (
    <UilComparison width={props.options.size} height={props.options.size} color={props.options.color} />
  ),
  BusinessChat: (props: IconProps) => (
    <UilCommentChartLine width={props.options.size} height={props.options.size} color={props.options.color} />
  ),
};

const iconColorClass: {
  [name: string]: { regular: string; circle: string; hex: string };
} = {
  blue: {
	// TODO convert to css modules
    regular: "text-blue-400",
    circle: "bg-blue-400 dark:bg-blue-500 text-blue-50 pt-10",
    hex: "#A3B6E8",
  },
  teal: {
	// TODO convert to css modules
    regular: "text-orange-400",
    circle: "bg-orange-400 dark:bg-orange-500 text-orange-50",
    hex: "#F2A998",
  },
  orange: {
	// TODO convert to css modules
    regular: "text-orange-400",
    circle: "bg-orange-400 dark:bg-orange-500 text-orange-50",
    hex: "#F2A998",
  },
  white: {
	// TODO convert to css modules
    regular: "text-white opacity-80",
    circle: "bg-white-400 dark:bg-white-500 text-white-50",
    hex: "#fff",
  },
};

// TODO convert to css modules
const iconSizeClass = {
  xs: "w-6 h-6 flex-shrink-0",
  small: "w-8 h-8 flex-shrink-0",
  medium: "w-12 h-12 flex-shrink-0",
  large: "w-14 h-14 flex-shrink-0",
  xl: "w-16 h-16 flex-shrink-0",
  custom: "",
};



interface IconProps {
  options: {
    name: string;
    className: string;
    size: "xs" | "small" | "medium" | "large" | "xl" | "custom";
    style: "circle" | "float";
	color: string;
  };
}

export const Icon = ({
  options,
}:IconProps) => {
  if (IconOptions[options.name] === null || IconOptions[options.name] === undefined) {
    return null;
  }

  const { name, color = "blue", size = "small", style = "regular" } = data;

  const theme = useTheme();

  const IconSVG = IconOptions[name];

  const iconSizeClasses =
    typeof size === "string"
      ? iconSizeClass[size]
      : iconSizeClass[Object.keys(iconSizeClass)[size]];

  const iconColor = color
    ? color === "primary"
      ? theme.color
      : color
    : theme.color;

  if (style == "circle") {
    return (
      <div

        className={`relative z-10 inline-flex items-center justify-center flex-shrink-0 ${iconSizeClasses} rounded-full ${iconColorClass[iconColor].circle} ${className}`}
      >
        <IconSVG className="w-2/3 h-2/3" />
      </div>
    );
  } else {
    const iconColorClasses =
      iconColorClass[
        parentColor === "primary" &&
        (iconColor === theme.color || iconColor === "primary")
          ? "white"
          : iconColor
      ]?.regular;
    return (
      <IconSVG
        data-tina-field={tinaField}
        className={`${iconSizeClasses} ${iconColorClasses} ${className}`}
        colorField={`${
          iconColorClass[color]?.hex ? iconColorClass[color]?.hex : "#000000"
        }`}
      />
    );
  }
};

export const iconSchema = {
  type: "object",
  label: "Icon",
  name: "icon",
  fields: [
    {
      type: "string",
      label: "Icon",
      name: "name",
      ui: {
        component: IconPickerInput,
      },
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      ui: {
        component: ColorPickerInput,
      },
    },
    {
      name: "style",
      label: "Style",
      type: "string",
      options: [
        {
          label: "Circle",
          value: "circle",
        },
        {
          label: "Float",
          value: "float",
        },
      ],
    },
  ],
};
