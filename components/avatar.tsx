import React from "react";
import {
  Avatar as MainAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Avatar, { genConfig } from "react-nice-avatar";
import { UserIcon } from "lucide-react";

interface Props {
  id: string;
  image?: string;
  size?: string;
  avatar?: boolean;
}

const fromQueryString = (queryString: any) => {
  return queryString
    .replace(/^\?/, "")
    .split("&")
    .reduce((acc: any, pair: string) => {
      const [key, value] = pair.split("=").map(decodeURIComponent);
      acc[key] = value;
      return acc;
    }, {});
};

export default function CustomAvatar({ id, image, size = "12" }: Props) {
  let cfg = id;
  if (image) {
    cfg = fromQueryString(image);
  }
  return (
    <>
      <Avatar
        id={id}
        shape="rounded"
        className={`h-${size} w-${size}`}
        {...genConfig(cfg)}
      />
    </>
  );
}
