// Packages:
import { cloneDeep } from 'lodash';

// Typescript:
export enum AttributeModifier {
  React,
  EasyEmail,
}

// Functions:
export const getPredefinedAttributes = () => JSON.parse(sessionStorage.getItem('predefined-attributes') ?? '{}') as Record<string, string>;

export const getCustomAttributes = () => JSON.parse(sessionStorage.getItem('custom-attributes') ?? '{}') as Record<string, string>;

export const setPredefinedAttributes = (modifier: AttributeModifier, callback: (_attributes: Record<string, string>) => Record<string, string>) => {
  const _attributes = cloneDeep(getPredefinedAttributes());
  const newAttributes = callback(_attributes);
  sessionStorage.setItem('predefined-attributes', JSON.stringify(newAttributes));
  window.postMessage(JSON.stringify({ modifier, type: 'predefined', attributes: newAttributes }), '*');
};

export const setCustomAttributes = (modifier: AttributeModifier, callback: (_attributes: Record<string, string>) => Record<string, string>) => {
  const _attributes = cloneDeep(getCustomAttributes());
  const newAttributes = callback(_attributes);
  sessionStorage.setItem('custom-attributes', JSON.stringify(newAttributes));
  window.postMessage(JSON.stringify({ modifier, type: 'custom', attributes: newAttributes }), '*');
};

export const generateUpdateCustomAttributeListener = (listenFor: AttributeModifier, callback: (newAttributes: Record<string, string>) => void) => (event: MessageEvent<any>) => {
  try {
    if (typeof event.data !== 'string') return;
    if (event.data.trim().length === 0) return;
    const message = JSON.parse(event.data) as any;
    if (message.modifier === listenFor && message.type === 'custom') callback(message.attributes);
  } catch (error) {
  }
};

export const generateUpdatePredefinedAttributeListener = (listenFor: AttributeModifier, callback: (newAttributes: Record<string, string>) => void) => (event: MessageEvent<any>) => {
  try {
    if (typeof event.data !== 'string') return;
    if (event.data.trim().length === 0) return;
    const message = JSON.parse(event.data) as any;
    if (message.modifier === listenFor && message.type === 'predefined') callback(message.attributes);
  } catch (error) {
  }
};
