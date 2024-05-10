import React from 'react';
import { AdvancedType } from 'easy-email-core';
import { Stack, TextStyle } from 'easy-email-editor';

import { TextBlockItem } from './TextBlockItem';
import { ImageBlockItem } from './ImageBlockItem';
import { SpacerBlockItem } from './SpacerBlockItem';
import { DividerBlockItem } from './DividerBlockItem';
import { HeroBlockItem } from './HeroBlockItem';
import { ButtonBlockItem } from './ButtonBlockItem';
import { AccordionBlockItem } from './AccordionBlockItem';
import { CarouselBlockItem } from './CarouselBlockItem';
import { NavbarBlockItem } from './NavbarBlockItem';
import { SocialBlockItem } from './SocialBlockItem';
import { WrapperBlockItem } from './WrapperBlockItem';
import { SectionBlockItem } from './SectionBlockItem';
import { GroupBlockItem } from './GroupBlockItem';
import { ColumnBlockItem } from './ColumnBlockItem';

export const defaultCategories = [
  {
    get title() {
      return String('Content');
    },
    name: 'CONTENT',
    blocks: [
      {
        type: AdvancedType.TEXT,
        get title() {
          return String('Text');
        },
        get description() {
          return String('This block allows you to display text in your email');
        },
        component: TextBlockItem,
      },
      {
        type: AdvancedType.IMAGE,
        get title() {
          return String('Image');
        },
        get description() {
          return (
            // @ts-ignore
            <Stack
              vertical
              spacing='none'
            >
              {/* @ts-ignore */}
              <TextStyle>
                {String(
                  'Displays a responsive image in your email. It is similar to the HTML \'&lt;img/&gt;\' tag. Note that if no width is provided, the image will use the parent column width.',
                )}
              </TextStyle>
              {/* @ts-ignore */}
            </Stack>
          );
        },
        component: ImageBlockItem,
      },
      {
        type: AdvancedType.BUTTON,
        get title() {
          return String('Button');
        },
        get description() {
          return String('Displays a customizable button.');
        },
        component: ButtonBlockItem,
      },
      {
        type: AdvancedType.HERO,
        get title() {
          return String('Hero');
        },
        get description() {
          return String(
            'This block displays a hero image. It behaves like an \'section\' with a single \'column\'.',
          );
        },
        component: HeroBlockItem,
      },
      {
        type: AdvancedType.NAVBAR,
        get title() {
          return String('Navbar');
        },
        get description() {
          return String(
            'Displays a menu for navigation with an optional hamburger mode for mobile devices.',
          );
        },
        component: NavbarBlockItem,
      },
      {
        type: AdvancedType.SPACER,
        get title() {
          return String('Spacer');
        },
        get description() {
          return String('Displays a blank space.');
        },
        component: SpacerBlockItem,
      },
      {
        type: AdvancedType.DIVIDER,
        get title() {
          return String('Divider');
        },
        get description() {
          return String(
            'Displays a horizontal divider that can be customized like a HTML border.',
          );
        },
        component: DividerBlockItem,
      },
      {
        type: AdvancedType.ACCORDION,
        get title() {
          return String('Accordion');
        },
        get description() {
          return String(
            'Accordion is an interactive component to stack content in tabs, so the information is collapsed and only the titles are visible. Readers can interact by clicking on the tabs to reveal the content, providing a great experience on mobile devices where space is scarce.',
          );
        },
        component: AccordionBlockItem,
      },
      {
        type: AdvancedType.CAROUSEL,
        get title() {
          return String('Carousel');
        },
        get description() {
          return String(
            'This block displays a gallery of images or \'carousel\'. Readers can interact by hovering and clicking on thumbnails depending on the email client they use.',
          );
        },
        component: CarouselBlockItem,
      },
      {
        type: AdvancedType.SOCIAL,
        get title() {
          return String('Social');
        },
        get description() {
          return String(
            'Displays calls-to-action for various social networks with their associated logo.',
          );
        },
        component: SocialBlockItem,
      },
    ],
  },
  {
    get title() {
      return String('Layout');
    },
    name: 'LAYOUT',
    blocks: [
      {
        type: AdvancedType.WRAPPER,
        get title() {
          return String('Wrapper');
        },
        get description() {
          return String(
            'Wrapper enables to wrap multiple sections together. It"s especially useful to achieve nested layouts with shared border or background images across sections.',
          );
        },
        component: WrapperBlockItem,
      },
      {
        type: AdvancedType.SECTION,
        get title() {
          return String('Section');
        },
        get description() {
          return (
            // @ts-ignore
            <Stack
              vertical
              spacing='none'
            >
              {/* @ts-ignore */}
              <TextStyle>
                {String(
                  'Sections are intended to be used as rows within your email. They will be used to structure the layout.',
                )}
              </TextStyle>
              {/* @ts-ignore */}
              <TextStyle>
                {String(
                  'Sections cannot nest in sections. Columns can nest in sections; all content must be in a column.',
                )}
              </TextStyle>
              {/* @ts-ignore */}
            </Stack>
          );
        },
        component: SectionBlockItem,
      },
      {
        type: AdvancedType.GROUP,
        get title() {
          return String('Group');
        },
        get description() {
          return String(
            'Group allows you to prevent columns from stacking on mobile. To do so, wrap the columns inside a group block, so they"ll stay side by side on mobile.',
          );
        },
        component: GroupBlockItem,
      },
      {
        type: AdvancedType.COLUMN,
        get title() {
          return String('Column');
        },
        get description() {
          return (
            // @ts-ignore
            <Stack
              vertical
              spacing='none'
            >
              {/* @ts-ignore */}
              <TextStyle>
                {String(`Columns enable you to horizontally organize the content within
                your sections. They must be located under "Section" block in order
                to be considered by the engine. To be responsive, columns are
                expressed in terms of percentage.`)}
              </TextStyle>
              {/* @ts-ignore */}
              <TextStyle>
                {String(`Every single column has to contain something because they are
                responsive containers, and will be vertically stacked on a mobile
                view.`)}
              </TextStyle>
              {/* @ts-ignore */}
            </Stack>
          );
        },
        component: ColumnBlockItem,
      },
    ],
  },
];
