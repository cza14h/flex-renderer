import React from 'react';

export function isInsideBoundary(e: React.DragEvent, row: boolean) {
  const { clientX, clientY, currentTarget } = e;
  const { top, height, left, width } = currentTarget.getBoundingClientRect();
  // console.log(top, left, width, height, clientX, clientY);

  if (row) {
    if (clientY > top + height / 10 && clientY < top + (9 * height) / 10) {
      return true;
    }
  } else {
    if (clientX > left + width / 10 && clientX < left + (9 * width) / 10) {
      return true;
    }
  }
  return false;
}

export function getCursorOffset(e: React.DragEvent) {
  const { clientX, clientY, currentTarget } = e;
  const { top, height, left, width } = currentTarget.getBoundingClientRect();
  const res = { top: false, bottom: false, left: false, right: false };
  if (clientX >= left + width / 2) res.right = true;
  else if (clientX < left + width / 2 && clientX >= left) res.left = true;
  if (clientY >= top + height / 2) res.bottom = true;
  else if (clientY < top + height / 2 && clientY >= top) res.top = true;
  return res;
}
