import React from "react";
import { ytChannelIdWpu, ytUrl, googleApiKey } from "@/lib/constants/public-api";
import Image from "next/image";

export default async function YoutubeHome() {
  const res = await fetch(`${ytUrl}?key=${googleApiKey}&id=${ytChannelIdWpu}&part=snippet`);
  const data = await res.json();

  const item = data?.items?.[0];
  const profileImg = item?.snippet?.thumbnails?.medium?.url;

  return <Image src={profileImg} alt="profile" width={200} height={200} priority />;
}
