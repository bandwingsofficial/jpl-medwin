export interface ImageDimensions {
  width: number;

  height: number;
}

export async function getImageDimensions(
  file: File
): Promise<ImageDimensions> {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      try {
        const image =
          new Image();

        const imageUrl =
          URL.createObjectURL(
            file
          );

        image.onload =
          () => {
            const width =
              image.naturalWidth;

            const height =
              image.naturalHeight;

            URL.revokeObjectURL(
              imageUrl
            );

            if (
              !width ||
              !height
            ) {
              reject(
                new Error(
                  "Unable to read image dimensions."
                )
              );

              return;
            }

            resolve({
              width,
              height,
            });
          };

        image.onerror =
          () => {
            URL.revokeObjectURL(
              imageUrl
            );

            reject(
              new Error(
                "Failed to load image."
              )
            );
          };

        image.src =
          imageUrl;
      } catch {
        reject(
          new Error(
            "Failed to process image."
          )
        );
      }
    }
  );
}