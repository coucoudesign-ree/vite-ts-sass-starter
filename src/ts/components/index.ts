// src/ts/components/index.ts

import '../../scss/style.scss';

import { initOpeningAnimation } from './loader';
import { initHeader } from './header';
import { initSmoothScroll } from './smooth-scroll';
import { initPagetop } from './pagetop';
import { initSwiper } from './swiper';
import { initInstagram } from './instagram';
import { initModal } from './modal';
import { initAccordion } from './accordion';
import { initForm } from '../form/form-handler';
import { initZipLookup } from '../form/zip';

document.addEventListener('DOMContentLoaded', () => {
  // 共通コンポーネント（各ファイル内でDOM存在チェック済み）
  initOpeningAnimation();
  initHeader();
  initSmoothScroll();
  initPagetop();

  // オプションコンポーネント（該当要素が存在する場合のみ初期化）
  if (document.querySelector('.swiper')) initSwiper();
  if (document.querySelector('#insta-feed')) void initInstagram();
  if (document.querySelector('[data-modal-trigger]')) initModal();
  if (document.querySelector('.c-accordion')) initAccordion();
  if (document.querySelector('#js-contact-form')) {
    initForm();
    initZipLookup();
  }
});
