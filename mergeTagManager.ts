// Packages:
import { cloneDeep } from 'lodash';

// Typescript:
export enum MergeTagModifier {
  React,
  EasyEmail,
}

// Functions:
export const getMergeTags = () => JSON.parse(sessionStorage.getItem('mergeTags') ?? '{}');

export const setMergeTags = (modifier: MergeTagModifier, callback: (_mergeTags: Record<string, string>) => Record<string, string>) => {
  const _mergeTags = cloneDeep(getMergeTags());
  const newMergeTags = callback(_mergeTags);
  sessionStorage.setItem('mergeTags', JSON.stringify(newMergeTags));
  window.postMessage(JSON.stringify({ modifier, mergeTags: newMergeTags }), '*');
};

export const generateUpdateMergeTagsListener = (listenFor: MergeTagModifier, callback: (newMergeTags: Record<string, string>) => void) => (event: MessageEvent<any>) => {
  try {
    if (typeof event.data !== 'string') return;
    if (event.data.trim().length === 0) return;
    const message = JSON.parse(event.data) as any;
    if (message.modifier === listenFor) callback(message.mergeTags);
  } catch (error) {
  }
};
