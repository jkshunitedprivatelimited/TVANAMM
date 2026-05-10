import { homePage } from './homePage';
import { aboutPage } from './aboutPage';
import { galleryPage } from './galleryPage';
import { blogPost } from './blogPost';
import { contactPage } from './contactPage';
import { siteSettings } from './siteSettings';
import { outlet } from './outlet';
import { customerReview } from './customerReview';
import { product } from './product';
import { productCategory } from './productCategory';
import { storeBanner } from './storeBanner';

export const schemaTypes = [
  homePage,
  aboutPage,
  galleryPage,
  blogPost,
  contactPage,
  siteSettings,
  outlet,
  customerReview,
  // E-Commerce
  product,
  productCategory,
  storeBanner,
];
