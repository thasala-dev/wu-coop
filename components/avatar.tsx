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

export default function CustomAvatar({
  id,
  image,
  size = "12",
  avatar = false,
}: Props) {
  if (image) {
    return (
      <MainAvatar className={`h-${size} w-${size} rounded`}>
        <AvatarImage src={image} alt={id} />
        <AvatarFallback className="rounded-md bg-gradient-to-br from-green-100 via-emerald-300 to-cyan-200">
          <UserIcon className="h-6 w-6 text-white" />
        </AvatarFallback>
      </MainAvatar>
    );
  }
  return (
    <>
      <Avatar
        id={id}
        shape="rounded"
        className={`h-${size} w-${size}`}
        {...genConfig(id)}
      />
    </>
  );
}
