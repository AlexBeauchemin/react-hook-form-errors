import type { FieldError } from "react-hook-form";
import { describe, it, expect } from "vitest";

import { flattenErrors } from "./index";

describe("Forms/Errors", () => {
  describe("flattenErrors", () => {
    describe("when the error object is empty", () => {
      it("should return an empty array if no errors are passed", () => {
        expect(flattenErrors({})).toEqual([]);
      });
    });
    describe("when the error object contains a deeply nested array", () => {
      it("should return all the errors", () => {
        const errors = {
          name: {
            message: "String must contain at least 1 character(s)",
            type: "too_small",
          },
          "address.label": {
            message: "Address label is required",
            type: "required",
          },
          images: [
            {
              type: "required",
              message: "Image is required",
              // This is taken from an actual error object
              // Looks like there's an issue with RHF typings
              // Type casting so typescript doesn't complain
            },
          ] as unknown as FieldError,
          addresses: [
            {
              info: {
                formattedAddress: {
                  message: "This is an address error",
                  type: "required",
                },
              },
            },
          ] as unknown as FieldError,
          message: { message: "A message error", type: "too_small" },
          type: { message: "A type error", type: "too_small" },
        } satisfies Parameters<typeof flattenErrors>[0];

        const flattenedErrors = flattenErrors(errors);

        expect(flattenedErrors[0]).toMatchObject({
          path: "name",
          message: "String must contain at least 1 character(s)",
        });
        expect(flattenedErrors[1]).toMatchObject({
          path: "address.label",
          message: "Address label is required",
        });
        expect(flattenedErrors[2]).toMatchObject({
          path: "images.0",
          message: "Image is required",
        });
        expect(flattenedErrors[3]).toMatchObject({
          path: "addresses.0.info.formattedAddress",
          message: "This is an address error",
        });
        expect(flattenedErrors[4]).toMatchObject({
          path: "message",
          message: "A message error",
        });
        expect(flattenedErrors[5]).toMatchObject({
          path: "type",
          message: "A type error",
        });
      });
    });
  });
});
