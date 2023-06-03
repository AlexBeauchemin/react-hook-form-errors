import type { FieldErrors } from "react-hook-form";

type Error = {
  fieldName: string;
  message: string;
};

/**
 * Reshape the react-hook-form errors object into a flat object that we can iterate over
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
      "fieldName": "name",
      "message": "this is an error"
    },
    {
      "fieldName": "purchaseOrdersConfig.thresholdType",
      "message": "This is an error for threshold type"
    },
    {
      "fieldName": "offices.0.address.formattedAddress",
      "message": "This is an address error"
    },
    {
      "fieldName": "images.0",
      "message": "Image is required"
    }
  ]
 */
export function flattenErrors(
  errors: FieldErrors,
  fieldNamePrefix?: string
): Error[] {
  const flattenedErrors: Error[] = [];
  // Handle the case where an error is an array of FieldErrors, each errors are
  // handled individually
  if (errors.message && typeof errors.message === "string")
    return [{ fieldName: fieldNamePrefix || "", message: errors.message }];

  // Normal errors object
  Object.entries(errors).forEach(([key, error]) => {
    const fieldName = fieldNamePrefix ? fieldNamePrefix + "." + key : key;
    // Test for message even if empty
    if (error?.message)
      flattenedErrors.push({
        fieldName,
        message: error?.message as unknown as string,
      });
    else if (Array.isArray(error)) {
      error.forEach((error: FieldErrors, index: number) =>
        flattenedErrors.push(...flattenErrors(error, fieldName + "." + index))
      );
    } else {
      if (error) {
        flattenedErrors.push(...flattenErrors(error as FieldErrors, fieldName));
      }
    }
  });

  return flattenedErrors;
}
