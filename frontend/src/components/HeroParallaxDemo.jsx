"use client";
import React from "react";
import { HeroParallax } from "./HeroParallax";

export function HeroParallaxDemo() {
  const products = [
    {
      title: "Tiziano Ferro",
      link: "#",
      thumbnail:
        "https://i.discogs.com/fZpK01ZPlsCdui-YlbLCIKyVRk8UDGQBSnD7rx-aIRM/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTI4Njgy/NS0xNjY3OTQ5Mjg5/LTI4OTAuanBlZw.jpeg",
    },
    {
      title: "Listen",
      link: "#",
      thumbnail: "src/assets/Silhouette with Headphones.jpeg",
    },
    {
      title: "Vinyls",
      link: "#",
      thumbnail: "src/assets/Vinyl Records in Neon.jpeg",
    },
    {
      title: "Party",
      link: "/",
      thumbnail: "src/assets/Dancing Woman in Nightclub.jpeg",
    },
    {
      title: "Lana2",
      link: "/",
      thumbnail: "src/assets/PLAYLISTS/P4.jpeg",
    },
    {
      title: "Concert together",
      link: "/",
      thumbnail: "src/assets/Concert Energy.jpeg",
    },
    {
      title: "Dua Lipa",
      link: "/",
      thumbnail:
        "https://i.discogs.com/XCD01pZdjgSkHERl8M9gsOH5RwPPfh0OjNbDcwlC2Ik/rs:fit/g:sm/q:90/h:500/w:500/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEwNDQx/MTQxLTE0OTc0OTg0/ODgtNTc3NC5qcGVn.jpeg",
    },
    {
      title: "Bruno Mars",
      link: "/",
      thumbnail:
        "https://i.discogs.com/DNtC-07FoTdbuceYw-IgN4TWdXyHK42ego1fv1nO3ow/rs:fit/g:sm/q:90/h:600/w:480/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTEzNTc2/OTMtMTYxODM5MzI2/MC04NzYwLmpwZWc.jpeg",
    },
    {
      title: "Music",
      link: "/",
      thumbnail: "src/assets/Modern Turntable with Mid-Century Flair.jpeg",
    },
    {
      title: "Lana",
      link: "/",
      thumbnail:
        "https://i.discogs.com/_WiwdBbscXHJhi-yFBP3TaeivgCgIAD0d2crLU3Vu0s/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQwMzk4/NzUtMTc0MTAyNzYz/MC0xMjgwLmpwZWc.jpeg",
    },
    {
      title: "Lana Del Rey",
      link: "/",
      thumbnail:
        "https://i.discogs.com/_WiwdBbscXHJhi-yFBP3TaeivgCgIAD0d2crLU3Vu0s/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTQwMzk4/NzUtMTc0MTAyNzYz/MC0xMjgwLmpwZWc.jpeg",
    },
    {
      title: "The Weeknd",
      link: "/",
      thumbnail:
        "https://i.discogs.com/RHnjjaO97GV4JqEdLVSLdBj6i5LetVLyZCrsg-Odi00/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk0MTQ3/NzEtMTY0NzI4NjE4/Ny02NDc4LmpwZWc.jpeg",
    },
    {
      title: "Billie Eilish",
      link: "/",
      thumbnail:
        "https://i.discogs.com/Sv9eC2atGFxE_Qez_JqN9TiVDCRf2LQ0C_c34EHVAL4/rs:fit/g:sm/q:90/h:600/w:480/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTU1OTAy/MTMtMTc0MDI1ODA3/NS0xMzEyLmpwZWc.jpeg",
    },
    {
      title: "Eminem",
      link: "/",
      thumbnail:
        "https://i.discogs.com/f6uDGYW0zIgh9OCWqtxxyUb9UlKpbvgH7lyi1673JX8/rs:fit/g:sm/q:90/h:600/w:476/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTM4NjYx/LTE2NTA4MjgzNjAt/NTA1OC5qcGVn.jpeg",
    },
    {
      title: "Miley Cyrus",
      link: "/",
      thumbnail:
        "https://i.discogs.com/FR200uYq1n9r6IWMjm6g4sd4lGQr8Wtjz0FrQHFmxB4/rs:fit/g:sm/q:90/h:600/w:493/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTY3NjQz/Mi0xNjMxMzU4MDEx/LTE2ODYuanBlZw.jpeg",
    },
  ];

  return <HeroParallax products={products} />;
}
