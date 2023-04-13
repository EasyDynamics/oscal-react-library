# Adding editing to components

## Text field editing

Currently our editing functionality is done with `OSCALEditableTextField`
& its helper component `OSCALEditableFieldAction`.

### Important props

- `fieldName`: Name of the field currently being editing.[^1]
- `canEdit`: A boolean passed from the parent component on whether to be
in Viewing or Editing mode. This will determine how `OSCALEditableTextField` is displayed.
- `editedValue`: The value of the object being changed via the REST api call.
This is **not required** if it is the same as `value`.[^2]
- `editedValueId`: The id of the `editedValue`. Only required if `editedValue` is set.
- `onFieldSave`: Currently this is the `handleFieldSave()` function passed down
from the `OSCALLoader`. All of the funcionality of editing require this function.
- `partialRestData`: A partial representation of the json object you are patching.
- `value`: The value of the field that is changed on the front end.

### Example PRs

- [Editing backmatter resources](https://github.com/EasyDynamics/oscal-react-library/pull/768)

[^1]: For example, "title" or "description".
[^2]: This is only included if editing a value would update a list of objects.
For example, editing a backmatter resource title would have an
`editedValue` of `backmatter.resources` but a value of `resource.title`.
