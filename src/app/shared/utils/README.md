## Utils Folder

The folder consists of files and folders which lends a helping hand.

We have file name as `utility.service.ts`. The names are pretty self-explanatory.

This file contains code snippets (a bunch of functions) which help us in achieving minor tasks.

## Form Validators Utility

The `form-validators.util.ts` file contains custom form validators that can be reused across the application:

### Available Validators:

1. **nameValidator**: Validates name fields (first name, last name)
   - Allows only letters, spaces, hyphens, and apostrophes
   - Prevents consecutive special characters
   - Ensures trimmed value is not empty

2. **emailUniquenessValidator**: Validates email uniqueness
   - Checks against existing email addresses
   - Supports edit mode by excluding current email

### Usage Example:

```typescript
import { FormValidators } from 'src/app/shared/utils/form-validators.util';

// In your component
this.userForm = this.fb.group({
  firstName: ['', [
    Validators.required,
    FormValidators.nameValidator
  ]],
  email: ['', [
    Validators.required,
    Validators.email
  ]]
});
```