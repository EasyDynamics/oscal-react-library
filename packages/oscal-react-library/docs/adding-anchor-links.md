# Adding Anchor Links

Anchor links provide value to users who wish to convenient navigate to elements
on the page quickly from a link. When selecting an anchor link, a fragment
(`#`) will appear in the browser search bar. When a link with a fragment is
entered into the search bar the user will be navigated directly to the matching
element on the page.

Ideally, anchor links are added to important text elements on the page,
including major headers and instances of items in lists, such as controls and
back matter resources.

## General Usage

Within an `oscal-react-library` component, in order to add an anchor link:

1. Navigate to the element/text
2. Surround the element/text within an `OSCALAnchorLinkHeader` component (which
   must be imported from `src/components/OSCALAnchorLinkHeader`)
3. (Optional) If you wish for the fragment to be a different value than the
   default value, specify a string with the `name` property
   - `name` by default is the embedded text within an `OSCALAnchorLinkHeader`,
     lower cased and hyphen separated

## A Basic Example

Here's an example of a header with an `OSCALAnchorLinkHeader`:

```js
<OSCALAnchorLinkHeader name="sample-header">
  <OSCALSectionHeader>Sample Section Header Text</OSCALSectionHeader>
</OSCALAnchorLinkHeader>
```

When the anchor link icon is selected, `#sample-header` will
appear at the end of the url.

## Other Important Notes

Anchor links have been customized to allow styling within them, however keep
the Anchor link around the core text and supported styling/component to avoid
the anchor link appearing in the improper place or functioning incorrectly.

While anchor links are typically thought to surround text section headers,
anchor links can be added to buttons and other components as well, as long as
text appears directly underneath the component or a value is provided.

If the element for the anchor link isn't rendered at the initial page load, such
as an item must be expanded/opened to reveal the element, the navigation to the
element will not work properly. In this case, the fragment from the url must be
passed to the component containing the element, and some state interaction must
be carried out to reveal the element when a valid fragment is recognized
(typically the fragment is a parameter in a `useEffect()`).
