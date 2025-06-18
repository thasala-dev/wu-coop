import React from "react";
import {
  Avatar as MainAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Avatar, { genConfig } from "react-nice-avatar";
import { UsersIcon } from "lucide-react";

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
      <MainAvatar
        className={`h-${size} w-${size} rounded border border-gray-200`}
      >
        <AvatarImage src={image} alt={id} />
        <AvatarFallback className="rounded-md bg-gray-100 text-gray-600">
          <UsersIcon className="h-6 w-6 text-gray-500" />
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
