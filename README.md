# react-hook-form-errors

## Goal

Reshape the react-hook-form errors object into a flat object that be iterated over.
This is useful for big and complex form, where it's easy to 

- Make a typo and mishandle an error somewhere
- Add a new field but forget to handle/display the errors related to that new field
- Deeply nested or complexe data structure which makes error handling complex

These can result in a form submit failure with no feedback shown to the user.
The user clicks the submit button and nothing happens, no submit and no error shown.
This library makes resolving this easy by providing a flattened array of all the errors that can be shown at the beginning or end of the form to provide a "fallback" error feedback containing all the errors.

## How to use

`npm i react-hook-form-errors`

```typescript
import { flattenErrors } from 'react-hook-form-errors'


export const FormErrorsSummary: React.FC = () => {
  const {
    formState: {
      errors,
    },
  } = useFormContext()

  const errorList = flattenErrors(errors)

  if (!errorList.length) return null

  return (
    <ul>
      {errorList.map((error) => (
        <li key={error.path}>
            {`${error.fieldName}: ${error.message}`}
        </li>
      ))}
    </ul>
  )
}
```

## Conversion example

For example, it would convert this deeply nested error object
```json
  {
      "name": { "message": "this is an error" },
      "level1": {
          "level2": {
              "message": "This is an error for threshold type"
          }
      },
      "addresses": [
          {
              "info": {
                  "formattedAddress": {
                      "message": "This is an address error"
                  }
              }
          }
      ],
      "images": [{ type: 'required', message: 'Image is required' }],
  }
```
To this
```json
  [
    {
      "fieldName": "name",
      "message": "this is an error"
    },
    {
      "fieldName": "level1.level2",
      "message": "This is an error for threshold type"
    },
    {
      "fieldName": "addresses.0.info.formattedAddress",
      "message": "This is an address error"
    },
    {
      "fieldName": "images.0",
      "message": "Image is required"
    }
  ]
```
