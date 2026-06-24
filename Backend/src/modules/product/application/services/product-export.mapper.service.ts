
// src/modules/product/application/services/product-export.mapper.service.ts

import { Injectable } from '@nestjs/common';

import { ParsedProduct } from '../types/product-import.types';

@Injectable()
export class ProductExportMapperService {
  map(products: any[]): ParsedProduct[] {
    return products.map((product) => {
      return {
        name: product.name,

        category: product.category?.name ?? '',

        subCategory:
          product.subCategory?.name ?? '',

        miniCategory:
          product.miniCategory?.name ?? '',

        brand: product.brand?.name ?? '',

        type:
          product.variants.length > 1
            ? 'VARIABLE'
            : 'SIMPLE',

        shortDescription:
          product.shortDescription ?? '',

        longDescription:
          product.longDescription ?? '',

        // =======================
        // ARRAYS
        // =======================

        features:
          product.features?.map(
            (feature: any) =>
              typeof feature === 'string'
                ? feature
                : feature?.value ??
                  feature?.text ??
                  '',
          ) ?? [],

        tags:
          product.tags?.map(
            (tag: any) =>
              typeof tag === 'string'
                ? tag
                : tag?.value ??
                  tag?.text ??
                  '',
          ) ?? [],

        displayNotes:
          product.displayNotes?.map(
            (note: any) =>
              typeof note === 'string'
                ? note
                : note?.value ??
                  note?.text ??
                  '',
          ) ?? [],

        specifications:
          product.specifications?.map(
            (spec: any) => ({
              key: spec.key,
              value: spec.value,
            }),
          ) ?? [],

        packing:
          product.packing?.map(
            (item: any) =>
              typeof item === 'string'
                ? item
                : item?.value ??
                  item?.text ??
                  '',
          ) ?? [],

        directionOfUse:
          product.directionOfUse?.map(
            (item: any) =>
              typeof item === 'string'
                ? item
                : item?.value ??
                  item?.text ??
                  '',
          ) ?? [],

        additionalInfo:
          product.additionalInfo?.map(
            (item: any) =>
              typeof item === 'string'
                ? item
                : item?.value ??
                  item?.text ??
                  '',
          ) ?? [],

        faq:
          product.faq?.map((faq: any) => ({
            question: faq.question,
            answer: faq.answer,
          })) ?? [],

        images: {
          main:
            product.images?.find(
              (image: any) =>
                image.isMain,
            )?.url ?? null,

          gallery:
            product.images
              ?.filter(
                (image: any) =>
                  !image.isMain,
              )
              .map(
                (image: any) =>
                  image.url,
              ) ?? [],
        },

        variants:
          product.variants.map(
            (variant: any) => ({
              sku: variant.sku,

              name: variant.name,

              purchasePrice:
                variant.purchasePrice,

              sellingPrice:
                variant.sellingPrice,

              mrp: variant.mrp,

              quantity:
                variant.quantity,

              attributes:
                variant.attributes ??
                {},

              averageRating:
                variant.averageRating ??
                0,

              reviewCount:
                variant.reviewCount ??
                0,

              isWeighted:
                variant.isWeighted,

              warrantyMonths:
                variant.warrantyMonths,

              images: {
                main:
                  variant.images?.find(
                    (image: any) =>
                      image.isMain,
                  )?.url ?? null,

                gallery:
                  variant.images
                    ?.filter(
                      (image: any) =>
                        !image.isMain,
                    )
                    .map(
                      (image: any) =>
                        image.url,
                    ) ?? [],
              },
            }),
          ),
      };
    });
  }
}

