import type { FieldErrors } from "react-hook-form";

type Error = {
  path: string;
  message: string;
};

/**
 * Reshape the react-hook-form errors object into a flat object that can be iterated over
 * For example it would convert this deeply nested error object
 * {
      "name": { "message": "this is an error" },
      "purchaseOrdersConfig": {
          "thresholdType": {
              "message": "This is an error for threshold type"
          }
      },
      "offices": [
          {
              "address": {
                  "formattedAddress": {
                      "message": "This is an address error"
                  }
              }
          }
      ],
      "images": [{ type: 'required', message: 'Image is required' }],
  }

  To this

  [
    {
      "path": "name",
      "message": "this is an error"
    },
    {
      "path": "purchaseOrdersConfig.thresholdType",
      "message": "This is an error for threshold type"
    },
    {
      "path": "offices.0.address.formattedAddress",
      "message": "This is an address error"
    },
    {
      "path": "images.0",
      "message": "Image is required"
    }
  ]
 */
export function flattenErrors(
  errors: FieldErrors,
  pathPrefix?: string
): Error[] {
  const flattenedErrors: Error[] = [];
  // This shouldn't happen, but just in case
  if (!errors) return flattenedErrors;
  // Handle the case where an error is an array of FieldErrors, each errors are
  // handled individually
  if (errors.message && typeof errors.message === "string")
    return [{ path: pathPrefix || "", message: errors.message }];

  // Normal errors object
  Object.entries(errors).forEach(([key, error]) => {
    const path = pathPrefix ? pathPrefix + "." + key : key;
    // Test for message even if empty
    if (error?.message)
      flattenedErrors.push({
        path,
        message: error?.message as unknown as string,
      });
    else if (Array.isArray(error)) {
      error.forEach((error: FieldErrors, index: number) =>
        flattenedErrors.push(...flattenErrors(error, path + "." + index))
      );
    } else {
      if (error) {
        flattenedErrors.push(...flattenErrors(error as FieldErrors, path));
      }
    }
  });

  return flattenedErrors;
}
