"use client";

type Props = {
  error: Error;
};

export default function Error({ error }: Props) {
  <p>Could not fetch note details. {error.message}</p>;
}
